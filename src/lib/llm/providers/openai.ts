import { BaseAIProvider } from "./base";
import { LLMConfig, Rule, GenerateResponseOptions, SingleRuleResult } from "./types";
import { generateSystemPromptForRule, generateUserPromptForRule } from "../core/evaluator";
import { getSchemaForRule } from "../prompts/schema_evaluator";
import { OpenAI } from "openai";
import { zodTextFormat } from "openai/helpers/zod";

// OpenAI Provider for single rule evaluation
export class OpenAIProvider extends BaseAIProvider {
    private openai: OpenAI;
  
    constructor(config: LLMConfig) {
      super();
      this.openai = new OpenAI({
        apiKey: config.apiKey || '',
        baseURL: config.baseUrl || 'https://api.openai.com/v1/responses',
      });
    }
  
    async evaluateSingleRule(
      rule: Rule,
      config: LLMConfig,
      options: GenerateResponseOptions = {}
    ): Promise<SingleRuleResult> {
      console.log(`Starting single rule evaluation for rule: ${rule.id}`);
      const startTime = Date.now();
  
      try {
        const schema = getSchemaForRule(rule);
        const systemPrompt = generateSystemPromptForRule(rule);
        const userPrompt = generateUserPromptForRule(rule);
  
        const model = options.model || 'gpt-5-mini';
        const temperature = options.temperature || 0.3; // Lower temp for consistency
  
        const response = await this.openai.responses.parse({
          model,
          temperature,
          input: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          text: {
            format: zodTextFormat(schema, `Single Rule Evaluation - ${rule.id}`)
          }
        });
  
        const result = response.output_parsed;
        const endTime = Date.now();
        console.log(`Rule ${rule.id} evaluation completed in ${endTime - startTime}ms`);
  
        if (!result) {
          throw new Error(`No response from OpenAI for rule ${rule.id}`);
        }
  
        return result as SingleRuleResult;
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}: ${error}`);
        throw error;
      }
    }

    async generateResponse(
      prompts: { systemPrompt: string; userPrompt: string },
      config: LLMConfig,
      options: GenerateResponseOptions = {}
    ): Promise<string> {
      console.log('Starting OpenAI text generation for Approach B');
      
      try {
        const model = options.model || config.model || 'gpt-4o-mini';
        const temperature = options.temperature || config.temperature || 0.3;

        const response = await this.openai.chat.completions.create({
          model,
          temperature,
          messages: [
            { role: 'system', content: prompts.systemPrompt },
            { role: 'user', content: prompts.userPrompt }
          ]
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No response content from OpenAI');
        }

        console.log('OpenAI text generation completed successfully');
        return content;
      } catch (error) {
        console.error('Error in OpenAI text generation:', error);
        throw error;
      }
    }
  }