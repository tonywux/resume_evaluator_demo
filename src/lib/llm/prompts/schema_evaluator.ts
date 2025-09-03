import { zodTextFormat } from "openai/helpers/zod";
import { Rule } from "../providers/types";
import { z } from "zod";

// Generate schema based on rule type
export function getSchemaForRule(rule: Rule) {
    if (rule.type === 'TRUE_FALSE') {
        // Blacklist rule
        return z.object({
        rule_id: z.string().describe("The ID of the rule being evaluated"),
        rule_type: z.literal("BLACKLIST").describe("The type of rule"),
        dimension_summary: z.string().describe("One or two words to describe the blacklist rule"),
        qualification_check: z.enum(["DISQUALIFIED", "PASSED"]).describe("CRITICAL: Return 'DISQUALIFIED' if candidate matches blacklist criteria, 'PASSED' if candidate is acceptable"),
        reasoning: z.string().describe("One concise sentence to explain the result"),
        });
    } else {
        // RATING rule
        return z.object({
        rule_id: z.string().describe("The ID of the rule being evaluated"),
        rule_type: z.literal("RATING").describe("The type of rule"),
        dimension_summary: z.string().describe("One or two words to describe the rating rule"),
        evaluation_score: z.number().min(0).max(10).describe("Score from 0-10 for this evaluation criterion"),
        reasoning: z.string().describe("One or two sentences to explain the score"),
        weight: z.number().describe("Weight of this rule in overall evaluation"),
        });
    }
}

export function getJsonSchemaForRule(rule: Rule) {
    return zodTextFormat(getSchemaForRule(rule), `Single Rule Evaluation - ${rule.id}`);
}