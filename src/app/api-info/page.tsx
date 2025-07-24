"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  DocumentTextIcon,
  LinkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BeakerIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";
import { Button } from "../../../components/ui/Button";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { copyToClipboard } from "../../../lib/utils";

const codeExamples = {
  curl: `curl -X GET "https://your-api-endpoint.com/api/models" \\
  -H "Accept: application/json"`,
  
  javascript: `// Fetch AI models data
const response = await fetch('/api/models');
const models = await response.json();

// Filter by company
const openAIModels = models.filter(m => m.company === 'OpenAI');

// Sort by intelligence score
const topModels = models.sort((a, b) => b.overall_intelligence - a.overall_intelligence);`,

  python: `import requests

# Fetch models data
response = requests.get('https://your-api-endpoint.com/api/models')
models = response.json()

# Filter and sort
openai_models = [m for m in models if m['company'] == 'OpenAI']
top_models = sorted(models, key=lambda x: x['overall_intelligence'], reverse=True)`
};

export default function ApiInfoPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<keyof typeof codeExamples>('curl');

  const handleCopyCode = async (code: string, type: string) => {
    try {
      await copyToClipboard(code);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/models',
      description: 'Retrieve all AI models with their scores and metadata',
      parameters: [
        { name: 'company', type: 'string', description: 'Filter by company name (optional)' },
        { name: 'limit', type: 'number', description: 'Limit number of results (optional)' },
        { name: 'sort', type: 'string', description: 'Sort by field (intelligence, speed, etc.)' }
      ]
    },
    {
      method: 'GET',
      path: '/api/models/{id}',
      description: 'Get detailed information about a specific model',
      parameters: [
        { name: 'id', type: 'string', description: 'Model ID (required)' }
      ]
    },
    {
      method: 'GET',
      path: '/api/companies',
      description: 'List all companies with their model counts and statistics',
      parameters: []
    }
  ];

  const dataFields = [
    { field: 'id', type: 'string', description: 'Unique model identifier' },
    { field: 'name', type: 'string', description: 'Model display name' },
    { field: 'company', type: 'string', description: 'Company that created the model' },
    { field: 'overall_intelligence', type: 'number', description: 'Overall intelligence score (0-100)' },
    { field: 'benchmark_scores', type: 'object', description: 'Detailed benchmark scores' },
    { field: 'benchmark_scores.speed', type: 'number', description: 'Tokens per second' },
    { field: 'benchmark_scores.coding', type: 'number', description: 'Coding ability score' },
    { field: 'benchmark_scores.cost_efficiency', type: 'number', description: 'Cost efficiency rating' },
    { field: 'description', type: 'string', description: 'Model description (optional)' },
    { field: 'last_updated', type: 'string', description: 'ISO timestamp of last update' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <Header currentPath="/api-info" />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
              <CodeBracketIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
              API Documentation
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Access comprehensive AI model data programmatically. Our API provides real-time access to model rankings, 
            benchmark scores, and metadata from leading AI companies.
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BeakerIcon className="h-5 w-5" />
                Quick Start
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get started with our API in minutes. No authentication required for basic access.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selector */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(codeExamples).map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedExample === lang ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedExample(lang as keyof typeof codeExamples)}
                    className="capitalize"
                  >
                    {lang}
                  </Button>
                ))}
              </div>

              {/* Code Example */}
              <div className="relative">
                <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples[selectedExample]}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(codeExamples[selectedExample], selectedExample)}
                  className="absolute top-2 right-2 text-gray-300 hover:text-white"
                >
                  {copiedCode === selectedExample ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">API Status</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <Badge variant="success" size="sm">Operational</Badge>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <GlobeAltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Response Time</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-mono">~200ms</span> average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DocumentTextIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Data Freshness</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Updated <span className="font-semibold">daily</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                API Endpoints
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-3 mb-3">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'success' : 'info'} 
                        size="sm"
                        className="font-mono"
                      >
                        {endpoint.method}
                      </Badge>
                      <div className="flex-1">
                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {endpoint.description}
                        </p>
                      </div>
                    </div>
                    
                    {endpoint.parameters.length > 0 && (
                      <div className="ml-16">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Parameters:</h4>
                        <div className="space-y-1">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <div key={paramIndex} className="flex items-start gap-2 text-sm">
                              <code className="text-blue-600 dark:text-blue-400 font-mono">
                                {param.name}
                              </code>
                              <Badge variant="secondary" size="sm" className="text-xs">
                                {param.type}
                              </Badge>
                              <span className="text-gray-600 dark:text-gray-400">
                                {param.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Schema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Response Schema
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Structure of the data returned by our API endpoints.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Field</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataFields.map((field, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3">
                          <code className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                            {field.field}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" size="sm">
                            {field.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {field.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rate Limits & Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Rate Limits
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Requests per minute:</span>
                  <Badge variant="info" size="sm">60</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Requests per hour:</span>
                  <Badge variant="info" size="sm">1,000</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Requests per day:</span>
                  <Badge variant="info" size="sm">10,000</Badge>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Rate limits are per IP address. Contact us for higher limits.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5" />
                Attribution & Data Sources
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our data is sourced from independent benchmarks and analysis platforms:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <a 
                      href="https://artificialanalysis.ai/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Artificial Analysis
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <a 
                      href="https://lmarena.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      LM Arena
                    </a>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Attribution required:</strong> Please credit artificialanalysis.ai when using our data.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BeakerIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Full API Coming Soon!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We're working on a comprehensive public API with authentication, webhooks, and advanced filtering. 
                Stay tuned for updates!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Join Waitlist
                </Button>
                <Button variant="outline" size="lg">
                  View Roadmap
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
} 