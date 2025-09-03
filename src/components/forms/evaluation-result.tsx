'use client';


import { useEvaluation } from "@/lib/hooks/useEvaluation"
import { useEvaluationB } from "@/lib/hooks/useEvaluationB"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ListX, XCircle, FileSliders, Star, Loader2, Settings, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EvaluationResult() {
    const { result, isLoading, clearResult } = useEvaluation();
    const { result: resultB, isLoading: isLoadingB, clearResult: clearResultB } = useEvaluationB();
    
    console.log('EvaluationResult render - A:', { isLoading, result }, 'B:', { isLoadingB, resultB });

    // Check if either approach is loading
    if (isLoading || isLoadingB) {
        return (
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Evaluation Result</h2>
                <div className="flex bg-slate-100 p-4 rounded-lg text-sm items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isLoading && isLoadingB ? 'Both evaluations in progress...' : 
                     isLoading ? 'Approach A evaluation in progress...' :
                     'Approach B evaluation in progress...'}
                </div>
            </div>
        );
    }

    // If no results from either approach
    if (!result && !resultB) {
        return (
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Evaluation Result</h2>
                <div className="flex bg-slate-100 p-4 rounded-lg text-sm">
                    Click &quot;Approach A&quot; or &quot;Approach B&quot; to begin resume evaluation.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Evaluation Results</h2>
            
            <Tabs defaultValue={result ? "approach-a" : "approach-b"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="approach-a" className="flex items-center gap-2">
                        Approach A
                        {result && <Badge variant="secondary" className="bg-slate-50">{result.finalScore}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="approach-b" className="flex items-center gap-2">
                        Approach B
                        {resultB && <Badge variant="secondary" className="bg-slate-50">{resultB.totalScore}</Badge>}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="approach-a" className="space-y-4">
                    {result ? (
                        <div className="space-y-4">
                            
                            {/* Approach A Results - Original Format */}
                            <div className="bg-white border border-slate-200 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold">Overall</h3>
                                    <Badge variant="secondary" className="font-bold">
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

                            {/* Detailed Results for Approach A */}
                            <div className="bg-white border border-slate-200 rounded-lg">
                                <Accordion type="multiple" defaultValue={['blacklist', 'ratings']} className="w-full">
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
                                                                        {rule.evaluation_score}/10
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

                                    <AccordionItem value="metadata">
                                        <AccordionTrigger className="px-4">
                                            <div className="flex items-center gap-2">
                                                <FileSliders className="h-4 w-4 text-slate-600" />
                                                Metadata
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                <div><span className="font-medium">Provider:</span> {result.metadata.provider}</div>
                                                <div><span className="font-medium">Model:</span> {result.metadata.model}</div>
                                                <div><span className="font-medium">Rules Evaluated:</span> {result.metadata.rulesEvaluated}</div>
                                                <div><span className="font-medium">Execution Time:</span> {result.metadata.executionTimeMs}ms</div>
                                                <div className="col-span-2"><span className="font-medium">Timestamp:</span> {new Date(result.metadata.timestamp).toLocaleString()}</div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-100 p-4 rounded-lg text-sm text-center">
                            No Approach A results yet. Click "Approach A" to evaluate.
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={clearResult}>
                            Clear Result
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="approach-b" className="space-y-4">
                    {resultB ? (
                        <div className="space-y-4">
                            
                            {/* Approach B Results - New Format */}
                            <div className="bg-white border border-slate-200 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold">Total Score</h3>
                                    <Badge variant="secondary" className="font-bold">
                                        {resultB.totalScore}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Average: {resultB.summary.averageScore.toFixed(1)}</span>
                                        <span>Min: {resultB.summary.minScore} | Max: {resultB.summary.maxScore}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Results for Approach B */}
                            <div className="bg-white border border-slate-200 rounded-lg">
                                <Accordion type="multiple" defaultValue={['aspects']} className="w-full">
                                    <AccordionItem value="aspects">
                                        <AccordionTrigger className="px-4">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-slate-600" />
                                                Evaluation Aspects ({resultB.reasons.length})
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <div className="space-y-3">
                                                {resultB.reasons.map((aspect, index) => (
                                                    <div key={index} className="border-l-4 border-slate-200 pl-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-sm">
                                                                {aspect.item}
                                                            </span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {aspect.score}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-600">{aspect.reason}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="metadata-b">
                                        <AccordionTrigger className="px-4">
                                            <div className="flex items-center gap-2">
                                                <FileSliders className="h-4 w-4 text-slate-600" />
                                                Metadata
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                <div><span className="font-medium">Provider:</span> {resultB.metadata.provider}</div>
                                                <div><span className="font-medium">Model:</span> {resultB.metadata.model}</div>
                                                <div><span className="font-medium">Aspects Count:</span> {resultB.summary.aspectCount}</div>
                                                <div><span className="font-medium">Execution Time:</span> {resultB.metadata.executionTimeMs}ms</div>
                                                <div className="col-span-2"><span className="font-medium">Timestamp:</span> {new Date(resultB.metadata.timestamp).toLocaleString()}</div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-100 p-4 rounded-lg text-sm text-center">
                            No Approach B results yet. Click "Approach B" to evaluate.
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={clearResultB}>
                            Clear Result
                        </Button>
                    </div>

                </TabsContent>
            </Tabs>
        </div>
    );
}