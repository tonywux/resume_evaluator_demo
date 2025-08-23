'use client';


import { useEvaluation } from "@/lib/hooks/useEvaluation"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ListX, XCircle, FileSliders, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EvaluationResult() {
    const { result, isLoading, clearResult } = useEvaluation();
    
    console.log('EvaluationResult render - isLoading:', isLoading, 'result:', result);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Evaluation Result</h2>
                <div className="flex bg-slate-100 p-4 rounded-lg text-sm items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Evaluation in progress...
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Evaluation Result</h2>
                <div className="flex bg-slate-100 p-4 rounded-lg text-sm">
                    Click &quot;Start&quot; to begin resume evaluation.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Evaluation Result</h2>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearResult}
                >
                    Clear
                </Button>
            </div>

            {/* Overall Score */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Overall</h3>
                    <Badge variant="secondary">
                        {result.isDisqualified ? '0%' : `${result.percentage}%`}
                    </Badge>
                </div>
                
                {result.isDisqualified ? (
                    <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-5 w-5" />
                        <span>Blacklist criteria found</span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Score: {result.finalScore} / {result.maxPossibleScore}</span>
                        </div>
                        <Progress value={result.percentage} className="h-2" />
                    </div>
                )}
            </div>

            {/* Detailed Results */}
            <div className="bg-white border border-slate-200 rounded-lg">
                <Accordion type="multiple" defaultValue={['blacklist', 'ratings']} className="w-full">
                    {/* Blacklist Results */}
                    {result.breakdown.blacklistResults && result.breakdown.blacklistResults.length > 0 && (
                        <AccordionItem value="blacklist">
                            <AccordionTrigger className="px-4">
                                <div className="flex items-center gap-2">
                                    <ListX className="h-4 w-4 text-slate-600" />
                                    Blacklist Checks ({result.breakdown.blacklistResults.length})
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                                <div className="space-y-3">
                                    {result.breakdown.blacklistResults.map((rule) => (
                                        <div key={rule.rule_id} className="border-l-4 border-red-200 pl-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm">
                                                    {rule.dimension_summary}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600">{rule.reasoning}</p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Rating Results */}
                    {result.breakdown.ratingResults && result.breakdown.ratingResults.length > 0 && (
                        <AccordionItem value="ratings">
                            <AccordionTrigger className="px-4">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-slate-600" />
                                    Rating Evaluations ({result.breakdown.ratingResults.length})
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                                <div className="space-y-3">
                                    {result.breakdown.ratingResults.map((rule) => (
                                        <div key={rule.rule_id} className="border-l-4 border-slate-200 pl-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-sm">
                                                    {rule.dimension_summary}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {rule.evaluation_score}/5
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-xs">
                                                        Weight: {rule.weight}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600">{rule.reasoning}</p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Metadata */}
                    <AccordionItem value="metadata">
                        <AccordionTrigger className="px-4">
                            <div className="flex items-center gap-2">
                                <FileSliders className="h-4 w-4 text-slate-600" />
                                Metadata
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                <div>
                                    <span className="font-medium">Provider:</span> {result.metadata.provider}
                                </div>
                                <div>
                                    <span className="font-medium">Model:</span> {result.metadata.model}
                                </div>
                                <div>
                                    <span className="font-medium">Rules Evaluated:</span> {result.metadata.rulesEvaluated}
                                </div>
                                <div>
                                    <span className="font-medium">Execution Time:</span> {result.metadata.executionTimeMs}ms
                                </div>
                                <div>
                                    <span className="font-medium">Timestamp:</span> {new Date(result.metadata.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
        </div>
    );
}