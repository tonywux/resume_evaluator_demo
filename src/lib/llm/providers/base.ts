import { LLMConfig, Rule, GenerateResponseOptions, SingleRuleResult } from "./types"
import { OpenAIProvider } from "./openai";
import { QwenProvider } from "./qwen";
import { DeepSeekProvider } from "./deepseek";

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
        return new OpenAIProvider(config);
      case 'deepseek':
        return new DeepSeekProvider(config);
      case 'qwen':
        return new QwenProvider(config);
      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }
}