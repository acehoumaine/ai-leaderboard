import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import type { BenchmarkScores } from '../../../../lib/types';

// Zod schema for model validation
const ModelSchema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  overall_intelligence: z.number().min(0).max(100),
  benchmark_scores: z.object({
    speed: z.number().min(0).max(100).optional().nullable(),
    latency: z.number().optional().nullable(),
    price: z.number().optional().nullable(),
    coding: z.number().min(0).max(100).optional().nullable(),
    reasoning: z.number().min(0).max(100).optional().nullable(),
  }).passthrough(),
  source_id: z.string().min(1),
});

// Simple in-memory rate limit (per process)
let lastScrape = 0;
const MIN_INTERVAL = 5 * 60 * 1000; // 5 minutes

export async function POST(req: NextRequest) {
  // Auth check
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const now = Date.now();
  if (now - lastScrape < MIN_INTERVAL) {
    return NextResponse.json({ error: 'Please wait before scraping again.' }, { status: 429 });
  }
  lastScrape = now;

  const API_KEY = process.env.ARTIFICIAL_ANALYSIS_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not set in environment.' }, { status: 500 });
  }

  try {
    // Fetch from the official API
    const res = await fetch('https://artificialanalysis.ai/api/v2/data/llms/models', {
      headers: {
        'x-api-key': API_KEY,
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Leaderboard/1.0)'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch from Artificial Analysis API');
    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) throw new Error('Unexpected API response');

    // Map and upsert models
    let updated = 0;
    const skipped: any[] = [];
    for (const model of json.data) {
      // Sanitize and validate
      const name = (model.name || '').trim().slice(0, 100);
      const company = (model.model_creator?.name || '').trim().slice(0, 100);
      const overall_intelligence = Number(model.evaluations?.artificial_analysis_intelligence_index);
      const coding = model.evaluations?.artificial_analysis_coding_index;
      const speed = model.median_output_tokens_per_second;
      const latency = model.median_time_to_first_token_seconds;
      const price = model.pricing?.price_1m_blended_3_to_1;
      const source_id = (model.id || '').trim();
      const benchmark_scores: BenchmarkScores = {
        speed: speed !== undefined && speed !== null ? Number(speed) : undefined,
        latency: latency !== undefined && latency !== null ? Number(latency) : undefined,
        price: price !== undefined && price !== null ? Number(price) : undefined,
        coding: coding !== undefined && coding !== null ? Number(coding) : undefined,
      };
      const parsed = ModelSchema.safeParse({
        name,
        company,
        overall_intelligence,
        benchmark_scores,
        source_id,
      });
      if (!parsed.success) {
        const zodErr = parsed.error as import('zod').ZodError;
        skipped.push({ id: model.id, name, reason: zodErr.issues.map((e: any) => e.message).join('; ') });
        continue;
      }
      const { error } = await supabase.from('ai_models').upsert([
        parsed.data
      ], { onConflict: 'source_id' });
      if (!error) updated++;
    }

    return NextResponse.json({ updated, total: json.data.length, skipped });
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const GET = () => NextResponse.json({ error: 'Use POST' }, { status: 405 });
