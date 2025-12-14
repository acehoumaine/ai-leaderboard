"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

import { supabase } from "../../../lib/supabase";
import { formatRelativeTime } from "../../../lib/utils";

// Components
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";
import { Button } from "../../../components/ui/Button";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

interface SyncResult {
  updated: number;
  total: number;
  skipped?: Array<{ id: string; name: string; reason: string }>;
}

interface AdminStats {
  totalModels: number;
  totalCompanies: number;
  lastSyncTime: string | null;
  recentUpdates: number;
  avgIntelligence: number;
  topCompanies: Array<{ company: string; count: number; avgScore: number }>;
}

export default function AnalyticsPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: models, error } = await supabase
        .from("ai_models")
        .select("*");

      if (error) throw error;

      if (models) {
        const totalModels = models.length;
        const companies = new Set(models.map(m => m.company));
        const totalCompanies = companies.size;
        
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const recentUpdates = models.filter(m => 
          m.last_updated && new Date(m.last_updated) > lastWeek
        ).length;

        const avgIntelligence = models.reduce((sum, m) => sum + (m.overall_intelligence || 0), 0) / totalModels;

        const companyStats = Array.from(companies).map(company => {
          const companyModels = models.filter(m => m.company === company);
          return {
            company,
            count: companyModels.length,
            avgScore: companyModels.reduce((sum, m) => sum + (m.overall_intelligence || 0), 0) / companyModels.length
          };
        }).sort((a, b) => b.count - a.count).slice(0, 5);

        const lastSync = models.reduce((latest, model) => {
          const modelDate = model.last_updated ? new Date(model.last_updated) : new Date(0);
          return modelDate > latest ? modelDate : latest;
        }, new Date(0));

        setStats({
          totalModels,
          totalCompanies,
          lastSyncTime: lastSync.toISOString(),
          recentUpdates,
          avgIntelligence,
          topCompanies: companyStats
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    setSyncResult(null);
    
    try {
      const res = await fetch("/api/scrape-artificial-analysis", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Sync failed");
      
      setSyncResult(data);
      setSyncMessage(`✅ Sync completed! Updated ${data.updated} of ${data.total} models.`);
      
      // Reload stats after successful sync
      await loadStats();
    } catch (e: unknown) {
      const errorMessage = e && typeof e === 'object' && 'message' in e && typeof e.message === 'string' 
        ? e.message 
        : 'Sync failed';
      setSyncMessage(`❌ ${errorMessage}`);
    }
    
    setSyncing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <Header currentPath="/analytics" />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BeakerIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Monitor the AI model leaderboard data, sync with external sources, and view analytics and system statistics.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ArrowPathIcon className="h-5 w-5" />
                Data Synchronization
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data syncs automatically every day at 2 AM UTC. Use the button below to fetch the latest updates right now.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleSync}
                  isLoading={syncing}
                  size="lg"
                  leftIcon={<ArrowPathIcon className="h-5 w-5" />}
                  className="flex-1 sm:flex-none"
                >
                  {syncing ? "Syncing..." : "Sync the Hottest Updates"}
                </Button>
                
                {stats?.lastSyncTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ClockIcon className="h-4 w-4" />
                    Last sync: {formatRelativeTime(stats.lastSyncTime)}
                  </div>
                )}
              </div>

              {/* Sync Results */}
              {syncMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg border ${
                    syncMessage.startsWith('✅') 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {syncMessage.startsWith('✅') ? (
                      <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{syncMessage}</div>
                      {syncResult?.skipped && syncResult.skipped.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm opacity-75 hover:opacity-100">
                            {syncResult.skipped.length} models skipped (click to view)
                          </summary>
                          <div className="mt-2 space-y-1 text-xs">
                            {syncResult.skipped.map((item, index) => (
                              <div key={index} className="pl-4 border-l-2 border-current/20">
                                <strong>{item.name || item.id}</strong>: {item.reason}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Dashboard */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Total Models */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Models
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalModels}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Companies */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Companies
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalCompanies}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <BuildingOfficeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Recent Updates
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.recentUpdates}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last 7 days
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                    <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Intelligence */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Avg Intelligence
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.avgIntelligence.toFixed(1)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                    <BeakerIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top Companies */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5" />
                  Top Companies by Model Count
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topCompanies.map((company, index) => (
                    <div key={company.company} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {company.company}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Avg Intelligence: {company.avgScore.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" size="md">
                        {company.count} models
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
} 