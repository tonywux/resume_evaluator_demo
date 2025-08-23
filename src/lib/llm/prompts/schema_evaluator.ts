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
        dimension_summary: z.string().describe("Brief summary of what this blacklist rule evaluates"),
        evaluation_result: z.boolean().describe("True if blacklisted (disqualified), false if passed"),
        reasoning: z.string().describe("Detailed explanation of why the candidate was/wasn't blacklisted"),
        });
    } else {
        // RATING rule
        return z.object({
        rule_id: z.string().describe("The ID of the rule being evaluated"),
        rule_type: z.literal("RATING").describe("The type of rule"),
        dimension_summary: z.string().describe("Brief summary of what this rule evaluates"),
        evaluation_score: z.number().min(0).max(5).describe("Score from 0-5 for this evaluation criterion"),
        reasoning: z.string().describe("Detailed explanation of the score given"),
        weight: z.number().describe("Weight of this rule in overall evaluation"),
        });
    }
}

export function getJsonSchemaForRule(rule: Rule) {
    return zodTextFormat(getSchemaForRule(rule), `Single Rule Evaluation - ${rule.id}`);
}