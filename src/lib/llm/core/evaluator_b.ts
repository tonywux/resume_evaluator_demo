import { BaseAIProvider } from "../providers/base";
import { EvaluationRequestB, EvaluationResultB, LLMConfig, GenerateResponseOptions } from "../providers/types";

/**
 * Approach B: System prompt + User prompt evaluation
 * Uses a single evaluation call with custom prompts instead of multiple rule-based calls
 */

export async function evaluateWithSystemUserPrompts(
    provider: BaseAIProvider,
    request: EvaluationRequestB,
    config: LLMConfig,
    options?: GenerateResponseOptions
): Promise<EvaluationResultB> {
    console.log('Starting Approach B evaluation with system/user prompts');
    
    // Prepare the user prompt by replacing placeholders
    const populatedUserPrompt = request.userPrompt
        .replace(/\{resume\}/g, request.resume)
        .replace(/\{jobDescription\}/g, request.jobDescription)
        .replace(/\{job_description\}/g, request.jobDescription); // Support both formats
    
    try {
        // Make a single LLM call with the system and user prompts
        const response = await provider.generateResponse({
            systemPrompt: request.systemPrompt,
            userPrompt: populatedUserPrompt
        }, config, options);
        
        // Parse the response to extract the evaluation structure
        const parsedResult = parseEvaluationResponse(response);
        
        console.log('Approach B evaluation completed successfully');
        return parsedResult;
        
    } catch (error) {
        console.error('Failed to evaluate with system/user prompts:', error);
        throw new Error(`Evaluation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Parse the LLM response and extract the evaluation structure
 * Expected format:
 * total score: X
 * reasons:[
 *   item: evaluation aspect
 *   score: aspect score  
 *   reason: aspect analysis reason
 * ]
 */
function parseEvaluationResponse(response: string): EvaluationResultB {
    try {
        // First, try to parse as JSON if the response is structured JSON
        if (response.trim().startsWith('{') || response.trim().startsWith('[')) {
            const jsonResult = JSON.parse(response);
            if (jsonResult.totalScore !== undefined && jsonResult.reasons) {
                return {
                    totalScore: jsonResult.totalScore,
                    reasons: jsonResult.reasons
                };
            }
        }
        
        // Otherwise, parse the text format
        const result: EvaluationResultB = {
            totalScore: 0,
            reasons: []
        };
        
        // Extract total score
        const totalScoreMatch = response.match(/total\s+score\s*:\s*(\d+(?:\.\d+)?)/i);
        if (totalScoreMatch) {
            result.totalScore = parseFloat(totalScoreMatch[1]);
        }
        
        // Extract reasons section
        const reasonsMatch = response.match(/reasons\s*:\s*\[([\s\S]*?)\]/i);
        if (reasonsMatch) {
            const reasonsText = reasonsMatch[1];
            
            // Split by items (look for lines starting with "item:")
            const itemMatches = reasonsText.split(/(?=item\s*:)/i);
            
            for (const itemText of itemMatches) {
                if (!itemText.trim()) continue;
                
                const itemMatch = itemText.match(/item\s*:\s*(.+?)(?=score\s*:|$)/i);
                const scoreMatch = itemText.match(/score\s*:\s*(\d+(?:\.\d+)?)/i);
                const reasonMatch = itemText.match(/reason\s*:\s*(.+?)(?=item\s*:|$)/i);
                
                if (itemMatch && scoreMatch && reasonMatch) {
                    result.reasons.push({
                        item: itemMatch[1].trim(),
                        score: parseFloat(scoreMatch[1]),
                        reason: reasonMatch[1].trim()
                    });
                }
            }
        }
        
        // Fallback: if no structured format found, try to extract basic information
        if (result.reasons.length === 0) {
            console.warn('Could not parse structured response, attempting basic extraction');
            
            // Look for any numerical values that might be scores
            const numbers = response.match(/\d+(?:\.\d+)?/g);
            if (numbers && numbers.length > 0) {
                result.totalScore = parseFloat(numbers[0]);
            }
            
            // Create a single reason with the full response
            result.reasons.push({
                item: "Overall Evaluation",
                score: result.totalScore,
                reason: response.trim()
            });
        }
        
        return result;
        
    } catch (error) {
        console.error('Failed to parse evaluation response:', error);
        
        // Return a fallback result
        return {
            totalScore: 0,
            reasons: [{
                item: "Parse Error",
                score: 0,
                reason: `Failed to parse response: ${response.substring(0, 200)}...`
            }]
        };
    }
}

/**
 * Validate that the evaluation result has the expected structure
 */
export function validateEvaluationResult(result: EvaluationResultB): boolean {
    if (typeof result.totalScore !== 'number') {
        console.warn('Invalid totalScore in evaluation result');
        return false;
    }
    
    if (!Array.isArray(result.reasons)) {
        console.warn('Invalid reasons array in evaluation result');
        return false;
    }
    
    for (const reason of result.reasons) {
        if (typeof reason.item !== 'string' || 
            typeof reason.score !== 'number' || 
            typeof reason.reason !== 'string') {
            console.warn('Invalid reason structure in evaluation result', reason);
            return false;
        }
    }
    
    return true;
}

/**
 * Calculate summary statistics for the evaluation result
 */
export function calculateEvaluationSummary(result: EvaluationResultB): {
    averageScore: number;
    maxScore: number;
    minScore: number;
    aspectCount: number;
} {
    if (result.reasons.length === 0) {
        return {
            averageScore: 0,
            maxScore: 0,
            minScore: 0,
            aspectCount: 0
        };
    }
    
    const scores = result.reasons.map(r => r.score);
    
    return {
        averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
        maxScore: Math.max(...scores),
        minScore: Math.min(...scores),
        aspectCount: result.reasons.length
    };
}
