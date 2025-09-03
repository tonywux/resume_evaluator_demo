import { BaseAIProvider } from "./base";
import { LLMConfig, Rule, EvaluationRule, GenerateResponseOptions, SingleRuleResult } from "./types";
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
      config: LLMConfig,
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
          throw new Error(`No response from DeepSeek for rule ${rule.id}`);
        }

        // Parse the JSON response and convert to SingleRuleResult format
        const parsedResult = JSON.parse(result);
        
        // Convert to standardized format
        const singleRuleResult: SingleRuleResult = {
          rule_id: rule.id,
          rule_type: rule.type === 'TRUE_FALSE' ? 'BLACKLIST' : 'RATING',
          dimension_summary: parsedResult.dimensionSummary || parsedResult.ruleExplanation || rule.description,
          reasoning: parsedResult.reasoning,
          weight: rule.type === 'RATING' ? (rule as EvaluationRule).weight : undefined
        };

        // Add type-specific fields
        if (rule.type === 'TRUE_FALSE') {
          singleRuleResult.qualification_check = parsedResult.qualification_check;
        } else {
          singleRuleResult.evaluation_score = parsedResult.score;
        }

        return singleRuleResult;
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
      console.log('Starting DeepSeek text generation for Approach B');
      
      try {
        const model = options.model || config.model || 'deepseek-chat';
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
          throw new Error('No response content from DeepSeek');
        }

        console.log('DeepSeek text generation completed successfully');
        return content;
      } catch (error) {
        console.error('Error in DeepSeek text generation:', error);
        throw error;
      }
    }
  }