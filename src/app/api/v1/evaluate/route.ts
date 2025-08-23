import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/llm/providers/base';
import { evaluateAllRules, calculateFinalScore } from '@/lib/llm/core/evaluator';
import { Rule, LLMConfig, BlacklistRule, EvaluationRule } from '@/lib/llm/providers/types';

export interface EvaluateRequest {
  resume: string;
  jobDescription: string;
  apiConfig: {
    provider: string;
    key: string;
  };
  rules: {
    evaluationRules: Array<{
      id: string;
      description: string;
      weight: number;
    }>;
    blacklist: {
      companyBlacklistEnabled: boolean;
      companyBlacklist: string;
      degreeBlacklistEnabled: boolean;
      degreeBlacklist: string;
    };
  };
  options?: {
    model?: string;
    temperature?: number;
  };
}

export interface EvaluateResponse {
  success: boolean;
  data?: {
    finalScore: number;
    isDisqualified: boolean;
    maxPossibleScore: number;
    percentage: number;
    breakdown: {
      blacklistResults?: Array<{
        rule_id: string;
        rule_type: string;
        dimension_summary: string;
        qualification_check?: "DISQUALIFIED" | "PASSED";
        reasoning: string;
      }>;
      ratingResults?: Array<{
        rule_id: string;
        rule_type: string;
        dimension_summary: string;
        evaluation_score?: number;
        reasoning: string;
        weight?: number;
      }>;
    };
    ruleResults: Array<{
      rule_id: string;
      rule_type: string;
      dimension_summary: string;
      qualification_check?: "DISQUALIFIED" | "PASSED";
      evaluation_score?: number;
      reasoning: string;
      weight?: number;
    }>;
    metadata: {
      provider: string;
      model: string;
      rulesEvaluated: number;
      timestamp: string;
      executionTimeMs: number;
    };
  };
  error?: string;
  code?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<EvaluateResponse>> {
  try {
    // Parse the request body
    const body: EvaluateRequest = await request.json();
    
    // Validate required fields
    if (!body.resume?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Resume content is required',
        code: 'RESUME_MISSING'
      }, { status: 400 });
    }

    if (!body.jobDescription?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Job description is required',
        code: 'JOB_DESCRIPTION_MISSING'
      }, { status: 400 });
    }

    if (!body.apiConfig?.provider || !body.apiConfig?.key) {
      return NextResponse.json({
        success: false,
        error: 'API configuration is required',
        code: 'CONFIG_MISSING'
      }, { status: 400 });
    }

    if (!body.rules?.evaluationRules || body.rules.evaluationRules.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Evaluation rules are required',
        code: 'RULES_MISSING'
      }, { status: 400 });
    }

    // Create LLM config
    const baseUrls: Record<string, string> = {
      'openai': 'https://api.openai.com/v1',
      'deepseek': 'https://api.deepseek.com',
      'qwen': 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    };

    const defaultModels: Record<string, string> = {
      'openai': 'gpt-5',
      'deepseek': 'deepseek-chat', 
      'qwen': 'qwen-max-latest'
    };

    const config: LLMConfig = {
      apiKey: body.apiConfig.key,
      baseUrl: baseUrls[body.apiConfig.provider.toLowerCase()] || baseUrls['openai'],
      model: body.options?.model || defaultModels[body.apiConfig.provider.toLowerCase()] || defaultModels['openai'],
      temperature: body.options?.temperature || 0.3
    };

    // Convert rules to evaluator format
    const rules: Rule[] = [];

    // Convert evaluation rules
    body.rules.evaluationRules.forEach(rule => {
      const evaluationRule: EvaluationRule = {
        id: rule.id,
        type: 'RATING',
        description: rule.description,
        weight: rule.weight
      };
      rules.push(evaluationRule);
    });

    // Convert blacklist rules
    const { blacklist } = body.rules;
    
    if (blacklist.companyBlacklistEnabled && blacklist.companyBlacklist.trim()) {
      const companyRule: BlacklistRule = {
        id: 'company_blacklist',
        type: 'TRUE_FALSE',
        dimension: 'company',
        description: `Company blacklist check: ${blacklist.companyBlacklist}`
      };
      rules.push(companyRule);
    }

    if (blacklist.degreeBlacklistEnabled && blacklist.degreeBlacklist.trim()) {
      const degreeRule: BlacklistRule = {
        id: 'degree_blacklist',
        type: 'TRUE_FALSE', 
        dimension: 'education',
        description: `Education blacklist check: ${blacklist.degreeBlacklist}`
      };
      rules.push(degreeRule);
    }

    if (rules.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid evaluation rules configured',
        code: 'RULES_EMPTY'
      }, { status: 400 });
    }

    // Set global context for rule prompts
    globalThis.evaluationContext = {
      resume: body.resume,
      jobDescription: body.jobDescription,
      timestamp: new Date().toISOString()
    };

    // Initialize provider
    const provider = getProvider(body.apiConfig.provider, config);

    // Perform the evaluation
    console.log(`Starting evaluation with ${rules.length} rules`);
    const startTime = Date.now();

    const { results: ruleResults } = await evaluateAllRules(provider, rules, config, body.options);
    const scoreData = calculateFinalScore(ruleResults);

    const endTime = Date.now();
    console.log(`Evaluation completed in ${endTime - startTime}ms`);

    // Clean up global context
    delete globalThis.evaluationContext;

    const result = {
      ...scoreData,
      ruleResults,
      metadata: {
        provider: body.apiConfig.provider,
        model: config.model,
        rulesEvaluated: ruleResults.length,
        timestamp: new Date().toISOString(),
        executionTimeMs: endTime - startTime
      }
    };
    
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Evaluation API error:', error);
    
    // Clean up global context on error
    if (globalThis.evaluationContext) {
      delete globalThis.evaluationContext;
    }
    
    // Handle unexpected errors
    return NextResponse.json({
      success: false,
      error: `Evaluation failed: ${error.message || error}`,
      code: 'EVALUATION_FAILED'
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to evaluate resumes.',
    code: 'METHOD_NOT_ALLOWED'
  }, { status: 405 });
}
