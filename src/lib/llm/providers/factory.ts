import { LLMConfig } from "./types";
import { BaseAIProvider } from "./base";
import { OpenAIProvider } from "./openai";
import { QwenProvider } from "./qwen";
import { DeepSeekProvider } from "./deepseek";

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
