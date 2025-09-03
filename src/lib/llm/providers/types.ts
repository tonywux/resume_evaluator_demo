// Rule types matching your UI
export interface BlacklistRule {
    id: string;
    type: 'TRUE_FALSE';
    dimension: 'company' | 'education';
    description: string;
}
  
export interface EvaluationRule {
    id: string;
    type: 'RATING';
    description: string;
    weight: number; // 0.1 - 1.0
}
  
export type Rule = BlacklistRule | EvaluationRule;
  
export interface GenerateResponseOptions {
    model?: string;
    temperature?: number;
}
  
export interface LLMConfig {
    apiKey: string;
    baseUrl: string;
    model: string;
    temperature: number;
}
  
// Single rule evaluation result
export interface SingleRuleResult {
    rule_id: string;
    rule_type: 'RATING' | 'BLACKLIST';
    dimension_summary: string;
    qualification_check?: "DISQUALIFIED" | "PASSED"; // For BLACKLIST
    evaluation_score?: number;   // For RATING (0-5)
    reasoning: string;
    weight?: number;
}

// Approach B evaluation request types
export interface EvaluationRequestB {
    resume: string;
    jobDescription: string;
    systemPrompt: string;
    userPrompt: string;
}

// Individual reason/aspect for Approach B
export interface EvaluationAspect {
    item: string;          // evaluation aspect name
    score: number;         // aspect score (0-10 or similar scale)
    reason: string;        // analysis reason for this aspect
}

// Approach B evaluation result
export interface EvaluationResultB {
    totalScore: number;           // overall total score
    reasons: EvaluationAspect[];  // array of individual aspects
}