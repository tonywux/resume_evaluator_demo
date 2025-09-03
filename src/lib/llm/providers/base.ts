import { LLMConfig, Rule, GenerateResponseOptions, SingleRuleResult } from "./types"

// Abstract base class for AI providers
export abstract class BaseAIProvider {
    abstract evaluateSingleRule(
      rule: Rule,
      config: LLMConfig,
      options?: GenerateResponseOptions
    ): Promise<SingleRuleResult>;

    // New method for Approach B - direct text generation
    abstract generateResponse(
      prompts: { systemPrompt: string; userPrompt: string },
      config: LLMConfig,
      options?: GenerateResponseOptions
    ): Promise<string>;
}