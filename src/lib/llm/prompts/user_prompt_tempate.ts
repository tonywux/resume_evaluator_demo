import { BlacklistRule, EvaluationRule } from "../providers/types";
import { getJsonSchemaForRule } from "./schema_evaluator";

export const tfUserPromptTemplate = (rule: BlacklistRule) => {
    const context = globalThis.evaluationContext;
    return `  
RULE TO EVALUATE: ${rule.description}
RULE TYPE: Blacklist Check (${rule.dimension})

JOB DESCRIPTION:
###
${context?.jobDescription || 'Not provided'}
###

RESUME:
###
${context?.resume || 'Not provided'}
###
  `;
}

export const ratingUserPromptTemplate = (rule: EvaluationRule) => {
    const context = globalThis.evaluationContext;
    return `  
RULE TO EVALUATE: ${rule.description}
RULE TYPE: Rating (0-5 scale)

JOB DESCRIPTION:
###
${context?.jobDescription || 'Not provided'}
###

RESUME:
###
${context?.resume || 'Not provided'}
###
  `
}

export const qwenTfUserPromptTemplate = (rule: BlacklistRule) => {
    const context = globalThis.evaluationContext;
    return `
RULE TO EVALUATE: ${rule.description}
RULE TYPE: Blacklist Check (${rule.dimension})

JOB DESCRIPTION:
###
${context?.jobDescription || 'Not provided'}
###

RESUME:
###
${context?.resume || 'Not provided'}
###

Use the following JSON schema to generate the response:
${getJsonSchemaForRule(rule)}
  `
}

export const qwenRatingUserPromptTemplate = (rule: EvaluationRule) => {
    const context = globalThis.evaluationContext;
    return `
RULE TO EVALUATE: ${rule.description}
RULE TYPE: Rating (0-5 scale)

JOB DESCRIPTION:
###
${context?.jobDescription || 'Not provided'}
###

RESUME:
###
${context?.resume || 'Not provided'}
###

Use the following JSON schema to generate the response:
${getJsonSchemaForRule(rule)}
  `
}