import { BlacklistRule, EvaluationRule } from "../providers/types";
import { getJsonSchemaForRule } from "./schema_evaluator";

export const tfUserPromptTemplate = (rule: BlacklistRule) => {
    return `  
  RULE TO EVALUATE: ${rule.description}
  RULE TYPE: Blacklist Check (${rule.dimension})
  `;
}

export const ratingUserPromptTemplate = (rule: EvaluationRule) => {
    return `  
  RULE TO EVALUATE: ${rule.description}
  RULE TYPE: Rating (0-5 scale)
  RULE WEIGHT: ${rule.weight}
  `
}

export const qwenTfUserPromptTemplate = (rule: BlacklistRule) => {
    return `
  RULE TO EVALUATE: ${rule.description}
  RULE TYPE: Blacklist Check (${rule.dimension})

  Use the following JSON schema to generate the response:
  ${getJsonSchemaForRule(rule)}
  `
}

export const qwenRatingUserPromptTemplate = (rule: EvaluationRule) => {
    return `
  RULE TO EVALUATE: ${rule.description}
  RULE TYPE: Rating (0-5 scale)
  RULE WEIGHT: ${rule.weight}

  Use the following JSON schema to generate the response:
  ${getJsonSchemaForRule(rule)}
  `
}