import { LLMConfig, Rule, GenerateResponseOptions, SingleRuleResult } from "./types"

// Abstract base class for AI providers
export abstract class BaseAIProvider {
    abstract evaluateSingleRule(
      rule: Rule,
      config: LLMConfig,
      options?: GenerateResponseOptions
    ): Promise<SingleRuleResult>;
}
  
// Factory function
export function getProvider(providerName: string, config: LLMConfig): BaseAIProvider {
    switch (providerName.toLowerCase()) {
      case 'openai':
        // Dynamic import to avoid circular dependency
        const { OpenAIProvider } = require("./openai");
        return new OpenAIProvider(config);
      case 'deepseek':
        const { DeepSeekProvider } = require("./deepseek");
        return new DeepSeekProvider(config);
      case 'qwen':
        const { QwenProvider } = require("./qwen");
        return new QwenProvider(config);
      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }
}