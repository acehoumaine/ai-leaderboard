import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET() {
  try {
    // Get all models to calculate company statistics
    const { data: models, error } = await supabase
      .from("ai_models")
      .select("id, name, company, overall_intelligence, benchmark_scores, last_updated");

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch companies data' },
        { status: 500 }
      );
    }

    // Calculate company statistics
    const companyStats: Record<string, {
      name: string;
      modelCount: number;
      averageIntelligence: number;
      totalIntelligence: number;
      topModel: typeof models[0] | null;
      hasCoding: boolean;
      hasSpeed: boolean;
      lastUpdated: string | null;
    }> = {};

    models.forEach((model) => {
      const company = model.company;
      
      if (!companyStats[company]) {
        companyStats[company] = {
          name: company,
          modelCount: 0,
          averageIntelligence: 0,
          totalIntelligence: 0,
          topModel: null,
          hasCoding: false,
          hasSpeed: false,
          lastUpdated: null
        };
      }

      companyStats[company].modelCount++;
      companyStats[company].totalIntelligence += model.overall_intelligence || 0;

      // Track top model by intelligence
      if (!companyStats[company].topModel || (model.overall_intelligence || 0) > (companyStats[company].topModel.overall_intelligence || 0)) {
        companyStats[company].topModel = model;
      }

      // Check for coding and speed benchmarks
      if (model.benchmark_scores?.coding) {
        companyStats[company].hasCoding = true;
      }
      if (model.benchmark_scores?.speed) {
        companyStats[company].hasSpeed = true;
      }

      // Track last updated
      if (model.last_updated) {
        const modelDate = new Date(model.last_updated);
        if (!companyStats[company].lastUpdated || modelDate > new Date(companyStats[company].lastUpdated)) {
          companyStats[company].lastUpdated = model.last_updated;
        }
      }
    });

    // Calculate averages and format response
    const companies = Object.values(companyStats).map((company) => ({
      name: company.name,
      modelCount: company.modelCount,
      averageIntelligence: company.modelCount > 0 ? Math.round((company.totalIntelligence / company.modelCount) * 100) / 100 : 0,
      topModel: company.topModel ? {
        id: (company.topModel as typeof models[0]).id,
        name: (company.topModel as typeof models[0]).name,
        intelligence: (company.topModel as typeof models[0]).overall_intelligence
      } : null,
      capabilities: {
        coding: company.hasCoding,
        speed: company.hasSpeed
      },
      lastUpdated: company.lastUpdated
    }));

    // Sort by model count descending
    companies.sort((a, b) => b.modelCount - a.modelCount);

    const response = {
      data: companies,
      meta: {
        timestamp: new Date().toISOString(),
        totalCompanies: companies.length,
        totalModels: models.length
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