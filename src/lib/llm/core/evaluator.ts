import { ratingSystemPrompt, tfSystemPrompt } from "../prompts/system_prompt";
import { ratingUserPromptTemplate, tfUserPromptTemplate } from "../prompts/user_prompt_tempate";
import { BaseAIProvider } from "../providers/base";
import { Rule, GenerateResponseOptions, SingleRuleResult, LLMConfig } from "../providers/types";

export interface PromptInfo {
  rule_id: string;
  rule_description: string;
  system_prompt: string;
  user_prompt: string;
}

export function generateSystemPromptForRule(rule: Rule): string {
    if (rule.type === 'TRUE_FALSE') {
      return tfSystemPrompt();
    } else {
      return ratingSystemPrompt();
    }
  }

export function generateUserPromptForRule(rule: Rule): string {
    if (rule.type === 'TRUE_FALSE') {
      return tfUserPromptTemplate(rule);
    } else {
      return ratingUserPromptTemplate(rule);
    }
  }

// Batch evaluation function to run all rules in parallel
export async function evaluateAllRules(
    provider: BaseAIProvider,
    rules: Rule[],
    config: LLMConfig,
    options?: GenerateResponseOptions
  ): Promise<{ results: SingleRuleResult[] }> {
    console.log(`Starting parallel evaluation of ${rules.length} rules`);
    
    // Generate prompts for all rules
    const prompts: PromptInfo[] = rules.map(rule => {
      const systemPrompt = generateSystemPromptForRule(rule);
      const userPrompt = generateUserPromptForRule(rule);
      
      return {
        rule_id: rule.id,
        rule_description: rule.description,
        system_prompt: systemPrompt,
        user_prompt: userPrompt
      };
    });
    
    // Run all evaluations in parallel
    const evaluationPromises = rules.map(rule => 
      provider.evaluateSingleRule(rule, config, options)
    );
  
    const results = await Promise.all(evaluationPromises);
    console.log(`All ${rules.length} rule evaluations completed`);
    
    return { results };
}


// Calculate final score based on individual results
export function calculateFinalScore(results: SingleRuleResult[]): {
    finalScore: number;
    isDisqualified: boolean;
    maxPossibleScore: number;
    percentage: number;
    breakdown: {
      blacklistResults?: SingleRuleResult[];
      ratingResults?: SingleRuleResult[];
    };
  } {
    const blacklistResults = results.filter(r => r.rule_type === 'BLACKLIST');
    const ratingResults = results.filter(r => r.rule_type === 'RATING');
  
    // Check for disqualification - handle both old boolean and new string format
    const isBlacklisted = blacklistResults.some(r => 
      r.qualification_check === "DISQUALIFIED"
    );
  
    if (isBlacklisted) {
      return {
        finalScore: 0,
        isDisqualified: true,
        maxPossibleScore: 0,
        percentage: 0,
        breakdown: { blacklistResults }
      };
    }
  
    // Calculate weighted score from rating rules
    let weightedScore = 0;
    let totalWeight = 0;
  
    ratingResults.forEach(result => {
      if (result.evaluation_score !== undefined && result.weight !== undefined) {
        weightedScore += result.evaluation_score * result.weight;
        totalWeight += result.weight;
      }
    });
  
    const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    const percentage = (finalScore / 5) * 100;
  
    return {
      finalScore: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
      isDisqualified: false,
      maxPossibleScore: 5,
      percentage: Math.round(percentage * 100) / 100,
      breakdown: { ratingResults }
    };
  }