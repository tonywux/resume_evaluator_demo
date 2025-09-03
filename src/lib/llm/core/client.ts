import { loadConfig, loadRuleset, isBrowser, ApiConfig, RulesetData } from "../../functions/storage";
import { BaseAIProvider } from "../providers/base";
import { getProvider } from "../providers/factory";
import { evaluateAllRules, calculateFinalScore } from "./evaluator";
import { Rule, LLMConfig, GenerateResponseOptions, SingleRuleResult, BlacklistRule, EvaluationRule } from "../providers/types";

/**
 * Input interface for evaluation requests
 */
export interface EvaluationInput {
  resume: string;
  jobDescription: string;
  options?: GenerateResponseOptions;
}

/**
 * Complete evaluation result
 */
export interface EvaluationResult {
  finalScore: number;
  isDisqualified: boolean;
  maxPossibleScore: number;
  percentage: number;
  breakdown: {
    blacklistResults?: SingleRuleResult[];
    ratingResults?: SingleRuleResult[];
  };
  ruleResults: SingleRuleResult[];
  metadata: {
    provider: string;
    model: string;
    rulesEvaluated: number;
    timestamp: string;
  };
}

/**
 * Error types for evaluation process
 */
export class EvaluationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'EvaluationError';
  }
}

/**
 * Main client class for handling resume evaluations
 */
export class ResumeEvaluationClient {
  private provider: BaseAIProvider | null = null;
  private config: LLMConfig | null = null;
  private rules: Rule[] = [];

  /**
   * Initialize the client by loading configuration and rules from localStorage
   */
  async initialize(): Promise<void> {
    if (!isBrowser()) {
      throw new EvaluationError('Client can only be used in browser environment', 'BROWSER_REQUIRED');
    }

    // Load API configuration
    const apiConfig = loadConfig();
    if (!apiConfig) {
      throw new EvaluationError('No API configuration found. Please set up your API key and provider.', 'CONFIG_MISSING');
    }

    // Load ruleset
    const rulesetData = loadRuleset();
    if (!rulesetData) {
      throw new EvaluationError('No evaluation rules found. Please configure your evaluation rules.', 'RULES_MISSING');
    }

    // Convert and validate configuration
    this.config = this.createLLMConfig(apiConfig);
    this.rules = this.convertRulesToEvaluatorFormat(rulesetData);

    if (this.rules.length === 0) {
      throw new EvaluationError('No valid evaluation rules configured.', 'RULES_EMPTY');
    }

    // Initialize provider
    try {
      this.provider = getProvider(apiConfig.provider, this.config);
    } catch (error) {
      throw new EvaluationError(`Failed to initialize provider: ${error}`, 'PROVIDER_INIT_FAILED');
    }
  }

  /**
   * Perform resume evaluation against job description
   */
  async evaluateResume(input: EvaluationInput): Promise<EvaluationResult> {
    if (!this.provider || !this.config) {
      throw new EvaluationError('Client not initialized. Call initialize() first.', 'CLIENT_NOT_INITIALIZED');
    }

    if (!input.resume?.trim()) {
      throw new EvaluationError('Resume content is required.', 'RESUME_MISSING');
    }

    if (!input.jobDescription?.trim()) {
      throw new EvaluationError('Job description is required.', 'JOB_DESCRIPTION_MISSING');
    }

    try {
      console.log(`Starting evaluation with ${this.rules.length} rules`);
      const startTime = Date.now();

      // Update global context for rule evaluation
      this.updateGlobalContext(input.resume, input.jobDescription);

      // Evaluate all rules in parallel
      const { results: ruleResults } = await evaluateAllRules(
        this.provider,
        this.rules,
        this.config,
        input.options
      );

      // Calculate final score and breakdown
      const scoreData = calculateFinalScore(ruleResults);

      const endTime = Date.now();
      console.log(`Evaluation completed in ${endTime - startTime}ms`);

      return {
        ...scoreData,
        ruleResults,
        metadata: {
          provider: this.getProviderName(),
          model: input.options?.model || this.getDefaultModel(),
          rulesEvaluated: ruleResults.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Evaluation failed:', error);
      throw new EvaluationError(`Evaluation failed: ${error}`, 'EVALUATION_FAILED');
    }
  }

  /**
   * Get current configuration status
   */
  getStatus(): {
    isInitialized: boolean;
    hasConfig: boolean;
    hasRules: boolean;
    provider?: string;
    ruleCount?: number;
  } {
    return {
      isInitialized: this.provider !== null && this.config !== null,
      hasConfig: this.config !== null,
      hasRules: this.rules.length > 0,
      provider: this.getProviderName(),
      ruleCount: this.rules.length
    };
  }

  /**
   * Convert API config to LLM config format
   */
  private createLLMConfig(apiConfig: ApiConfig): LLMConfig {
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

    return {
      apiKey: apiConfig.key,
      baseUrl: baseUrls[apiConfig.provider.toLowerCase()] || baseUrls['openai'],
      model: defaultModels[apiConfig.provider.toLowerCase()] || defaultModels['openai'],
      temperature: 0.3
    };
  }

  /**
   * Convert storage rules format to evaluator rules format
   */
  private convertRulesToEvaluatorFormat(rulesetData: RulesetData): Rule[] {
    const rules: Rule[] = [];

    // Convert evaluation rules
    rulesetData.evaluationRules.forEach(rule => {
      const evaluationRule: EvaluationRule = {
        id: rule.id,
        type: 'RATING',
        description: rule.description,
        weight: rule.weight
      };
      rules.push(evaluationRule);
    });

    // Convert blacklist rules
    const { blacklist } = rulesetData;
    
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

    return rules;
  }

  /**
   * Update global context that rules can access
   */
  private updateGlobalContext(resume: string, jobDescription: string): void {
    // Store in global context that the rule prompts can access
    if (typeof globalThis !== 'undefined') {
      globalThis.evaluationContext = {
        resume,
        jobDescription,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get provider name for metadata
   */
  private getProviderName(): string {
    if (!this.config) return 'unknown';
    
    const apiConfig = loadConfig();
    return apiConfig?.provider || 'unknown';
  }

  /**
   * Get default model for current provider
   */
  private getDefaultModel(): string {
    return this.config?.model || 'unknown';
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.provider = null;
    this.config = null;
    this.rules = [];
    
    // Clean up global context
    if (typeof globalThis !== 'undefined' && globalThis.evaluationContext) {
      delete globalThis.evaluationContext;
    }
  }
}

/**
 * Convenience function to create and initialize a client
 */
export async function createEvaluationClient(): Promise<ResumeEvaluationClient> {
  const client = new ResumeEvaluationClient();
  await client.initialize();
  return client;
}

/**
 * Quick evaluation function for simple use cases
 */
export async function evaluateResume(
  resume: string,
  jobDescription: string,
  options?: GenerateResponseOptions
): Promise<EvaluationResult> {
  const client = await createEvaluationClient();
  try {
    return await client.evaluateResume({ resume, jobDescription, options });
  } finally {
    client.destroy();
  }
}

// Global context interface for TypeScript
declare global {
  var evaluationContext: {
    resume: string;
    jobDescription: string;
    timestamp: string;
  } | undefined;
}