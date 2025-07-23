// Syncs AI models from Artificial Analysis API to Supabase ai_models table
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import type { BenchmarkScores } from '../../../../lib/types';

export async function POST() {
  const API_KEY = process.env.ARTIFICIAL_ANALYSIS_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not set in environment.' }, { status: 500 });
  }

  try {
    const res = await fetch('https://artificialanalysis.ai/api/v2/data/llms/models', {
      headers: {
        'x-api-key': API_KEY,
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Leaderboard/1.0)'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch from Artificial Analysis API');
    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) throw new Error('Unexpected API response');

    let updated = 0;
    const skipped: Array<{ id: string; name: string; reason: string; }> = [];
    for (const model of json.data) {
      const name = (model.name || '').trim().slice(0, 100);
      const company = (model.model_creator?.name || '').trim().slice(0, 100);
      const overall_intelligence = Number(model.evaluations?.artificial_analysis_intelligence_index);
      const coding = model.evaluations?.artificial_analysis_coding_index;
      const speed = model.median_output_tokens_per_second;
      const latency = model.median_time_to_first_token_seconds;
      const price = model.pricing?.price_1m_blended_3_to_1;
      const source_id = (model.id || '').trim();
      const cost_efficiency = price && price > 0 ? Number((1 / price).toFixed(3)) : undefined;
      const benchmark_scores: BenchmarkScores = {
        speed: speed !== undefined && speed !== null ? Number(speed.toFixed(1)) : undefined,
        latency: latency !== undefined && latency !== null ? Number(latency.toFixed(1)) : undefined,
        price: price !== undefined && price !== null ? Number(price.toFixed(3)) : undefined,
        cost_efficiency,
        coding: coding !== undefined && coding !== null ? Number(coding.toFixed(1)) : undefined,
      };
      if (!name || !company || isNaN(overall_intelligence) || !source_id) {
        skipped.push({ id: model.id, name, reason: 'Missing required fields' });
        continue;
      }
      const { error } = await supabase.from('ai_models').upsert([
        {
          name,
          company,
          overall_intelligence: Number(overall_intelligence.toFixed(1)),
          benchmark_scores,
          source_id,
        }
      ], { onConflict: 'source_id' });
      if (!error) updated++;
    }

    return NextResponse.json({ updated, total: json.data.length, skipped });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: e && typeof e === 'object' && 'message' in e && typeof e.message === 'string' ? e.message : String(e) || 'Server error' }, { status: 500 });
  }
}

export const GET = () => NextResponse.json({ error: 'Use POST' }, { status: 405 });
