import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import type { AIModel } from '../../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    const limit = parseInt(searchParams.get('limit') || '100');
    const sort = searchParams.get('sort') || 'overall_intelligence';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '25'), 100);

    // Build query
    let query = supabase
      .from("ai_models")
      .select("id, name, company, benchmark_scores, description, last_updated, overall_intelligence, source_id");

    // Apply filters
    if (company) {
      query = query.eq('company', company);
    }

    // Apply sorting
    if (sort === 'name') {
      query = query.order('name', { ascending: true });
    } else if (sort === 'company') {
      query = query.order('company', { ascending: true });
    } else if (sort === 'recent') {
      query = query.order('last_updated', { ascending: false });
    } else {
      // Default sort by overall_intelligence descending
      query = query.order('overall_intelligence', { ascending: false });
    }

    // Apply pagination
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch models' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let totalCount = count;
    if (!totalCount) {
      const { count: total } = await supabase
        .from("ai_models")
        .select("*", { count: 'exact', head: true });
      totalCount = total || 0;
    }

    const response = {
      data: data as AIModel[],
      pagination: {
        page,
        pageSize,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      },
      meta: {
        timestamp: new Date().toISOString(),
        filters: {
          company: company || null,
          sort,
          limit
        }
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 