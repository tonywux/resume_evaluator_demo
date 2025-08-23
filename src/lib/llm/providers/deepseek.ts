import { BaseAIProvider } from "./base";
import { LLMConfig, Rule, GenerateResponseOptions, SingleRuleResult } from "./types";
import { generateSystemPromptForRule } from "../core/evaluator";
import { qwenTfUserPromptTemplate, qwenRatingUserPromptTemplate } from "../prompts/user_prompt_tempate";
import { OpenAI } from "openai";

// OpenAI Provider for single rule evaluation
export class DeepSeekProvider extends BaseAIProvider {
    private openai: OpenAI;
  
    constructor(config: LLMConfig) {
      super();
      this.openai = new OpenAI({
        apiKey: config.apiKey || '',
        baseURL: config.baseUrl || 'https://api.deepseek.com',
      });
    }
  
    async evaluateSingleRule(
      rule: Rule,
      options: GenerateResponseOptions = {}
    ): Promise<SingleRuleResult> {
      console.log(`Starting single rule evaluation for rule: ${rule.id}`);
      const startTime = Date.now();
  
      try {
        const systemPrompt = generateSystemPromptForRule(rule);
        const userPrompt = rule.type === 'TRUE_FALSE' ? qwenTfUserPromptTemplate(rule) : qwenRatingUserPromptTemplate(rule);
  
        const model = options.model || 'deepseek-chat';
        const temperature = options.temperature || 0.3; // Lower temp for consistency
  
        const response = await this.openai.chat.completions.create({
          model,
          temperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: {
            type: 'json_object',
          }
        });
  
        const result = response.choices[0].message.content;
        const endTime = Date.now();
        console.log(`Rule ${rule.id} evaluation completed in ${endTime - startTime}ms`);
  
        if (!result) {
          throw new Error(`No response from OpenAI for rule ${rule.id}`);
        }
  
        return result as unknown as SingleRuleResult;
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}: ${error}`);
        throw error;
      }
    }
  }