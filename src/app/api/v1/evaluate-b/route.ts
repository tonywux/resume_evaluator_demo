import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/llm/providers/factory';
import { evaluateWithSystemUserPrompts, calculateEvaluationSummary, validateEvaluationResult } from '@/lib/llm/core/evaluator_b';
import { EvaluationRequestB, EvaluationResultB, LLMConfig } from '@/lib/llm/providers/types';

export interface EvaluateRequestB {
  resume: string;
  jobDescription: string;
  apiConfig: {
    provider: string;
    key: string;
  };
  prompts: {
    systemPrompt: string;
    userPrompt: string;
  };
  options?: {
    model?: string;
    temperature?: number;
  };
}

export interface EvaluateResponseB {
  success: boolean;
  data?: {
    totalScore: number;
    reasons: Array<{
      item: string;
      score: number;
      reason: string;
    }>;
    summary: {
      averageScore: number;
      maxScore: number;
      minScore: number;
      aspectCount: number;
    };
    metadata: {
      provider: string;
      model: string;
      timestamp: string;
      executionTimeMs: number;
    };
  };
  error?: string;
  code?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<EvaluateResponseB>> {
  try {
    // Parse the request body
    const body: EvaluateRequestB = await request.json();
    
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

    if (!body.prompts?.systemPrompt?.trim() || !body.prompts?.userPrompt?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Both system prompt and user prompt are required',
        code: 'PROMPTS_MISSING'
      }, { status: 400 });
    }

    // Create LLM config
    const baseUrls: Record<string, string> = {
      'openai': 'https://api.openai.com/v1',
      'deepseek': 'https://api.deepseek.com',
      'qwen': 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    };

    const defaultModels: Record<string, string> = {
      'openai': 'gpt-4o-mini',
      'deepseek': 'deepseek-chat', 
      'qwen': 'qwen-max-latest'
    };

    const config: LLMConfig = {
      apiKey: body.apiConfig.key,
      baseUrl: baseUrls[body.apiConfig.provider.toLowerCase()] || baseUrls['openai'],
      model: body.options?.model || defaultModels[body.apiConfig.provider.toLowerCase()] || defaultModels['openai'],
      temperature: body.options?.temperature || 0.3
    };

    // Create evaluation request
    const evaluationRequest: EvaluationRequestB = {
      resume: body.resume,
      jobDescription: body.jobDescription,
      systemPrompt: body.prompts.systemPrompt,
      userPrompt: body.prompts.userPrompt
    };

    // Initialize provider
    const provider = getProvider(body.apiConfig.provider, config);

    // Perform the evaluation
    console.log('Starting Approach B evaluation');
    const startTime = Date.now();

    const evaluationResult: EvaluationResultB = await evaluateWithSystemUserPrompts(
      provider, 
      evaluationRequest, 
      config, 
      body.options
    );

    const endTime = Date.now();
    console.log(`Approach B evaluation completed in ${endTime - startTime}ms`);

    // Validate the result
    if (!validateEvaluationResult(evaluationResult)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid evaluation result structure',
        code: 'INVALID_RESULT'
      }, { status: 500 });
    }

    // Calculate summary statistics
    const summary = calculateEvaluationSummary(evaluationResult);

    const result = {
      totalScore: evaluationResult.totalScore,
      reasons: evaluationResult.reasons,
      summary,
      metadata: {
        provider: body.apiConfig.provider,
        model: config.model,
        timestamp: new Date().toISOString(),
        executionTimeMs: endTime - startTime
      }
    };
    
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: unknown) {
    console.error('Approach B Evaluation API error:', error);
    
    // Handle unexpected errors
    return NextResponse.json({
      success: false,
      error: `Evaluation failed: ${error instanceof Error ? error.message : String(error)}`,
      code: 'EVALUATION_FAILED'
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to evaluate resumes with Approach B.',
    code: 'METHOD_NOT_ALLOWED'
  }, { status: 405 });
}
