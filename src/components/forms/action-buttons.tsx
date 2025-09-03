'use client';

import { Button } from "@/components/ui/button"
import { useInputs } from "@/lib/hooks/useInputs"
import { useEvaluation } from "@/lib/hooks/useEvaluation"
import { useEvaluationB } from "@/lib/hooks/useEvaluationB"
import { AlertCircle, Play, Loader2, Settings, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { hasConfig, hasRuleset, hasRuleset2 } from "@/lib/functions/storage"
import { useEffect, useState } from "react"

export default function ActionButtons() {
    const { resume, jobDescription } = useInputs();
    const { isLoading, startEvaluation, error, clearError } = useEvaluation();
    const { isLoading: isLoadingB, startEvaluationB, error: errorB, clearError: clearErrorB } = useEvaluationB();
    const [configStatus, setConfigStatus] = useState({
        hasApiConfig: false,
        hasRules: false,
        hasRulesB: false,
        isChecking: true
    });

    // Check configuration status on mount and when localStorage changes
    useEffect(() => {
        const checkConfig = () => {
            setConfigStatus({
                hasApiConfig: hasConfig(),
                hasRules: hasRuleset(),
                hasRulesB: hasRuleset2(),
                isChecking: false
            });
        };

        checkConfig();
        
        // Listen for localStorage changes
        const handleStorageChange = () => checkConfig();
        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically since localStorage events don't fire for same-window changes
        const interval = setInterval(checkConfig, 1000);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleStart = async () => {
        clearError();
        
        // Validate inputs
        if (!resume.trim()) {
            alert('Please enter resume content');
            return;
        }
        
        if (!jobDescription.trim()) {
            alert('Please enter job description');
            return;
        }

        // Check configuration
        if (!configStatus.hasApiConfig) {
            alert('Please configure your API key and provider in the header settings');
            return;
        }

        if (!configStatus.hasRules) {
            alert('Please configure evaluation rules before starting');
            return;
        }

        try {
            await startEvaluation(resume, jobDescription);
        } catch (error) {
            console.error('Start evaluation error:', error);
        }
    };

    const handleStartB = async () => {
        clearErrorB();
        
        // Validate inputs
        if (!resume.trim()) {
            alert('Please enter resume content');
            return;
        }
        
        if (!jobDescription.trim()) {
            alert('Please enter job description');
            return;
        }

        // Check configuration
        if (!configStatus.hasApiConfig) {
            alert('Please configure your API key and provider in the header settings');
            return;
        }

        if (!configStatus.hasRulesB) {
            alert('Please configure Approach B prompts before starting');
            return;
        }

        try {
            await startEvaluationB(resume, jobDescription);
        } catch (error) {
            console.error('Start Approach B evaluation error:', error);
        }
    };

    const handleStartBoth = async () => {
        clearError();
        clearErrorB();
        
        // Validate inputs
        if (!resume.trim()) {
            alert('Please enter resume content');
            return;
        }
        
        if (!jobDescription.trim()) {
            alert('Please enter job description');
            return;
        }

        // Check configuration
        if (!configStatus.hasApiConfig) {
            alert('Please configure your API key and provider in the header settings');
            return;
        }

        if (!configStatus.hasRules) {
            alert('Please configure Approach A evaluation rules before starting');
            return;
        }

        if (!configStatus.hasRulesB) {
            alert('Please configure Approach B prompts before starting');
            return;
        }

        try {
            // Run both evaluations in parallel
            await Promise.all([
                startEvaluation(resume, jobDescription),
                startEvaluationB(resume, jobDescription)
            ]);
        } catch (error) {
            console.error('Start both evaluations error:', error);
        }
    };

    const canStart = resume.trim() && 
                   jobDescription.trim() && 
                   configStatus.hasApiConfig && 
                   configStatus.hasRules && 
                   !isLoading && !isLoadingB;

    const canStartB = resume.trim() && 
                    jobDescription.trim() && 
                    configStatus.hasApiConfig && 
                    configStatus.hasRulesB && 
                    !isLoading && !isLoadingB;

    const canStartBoth = resume.trim() && 
                       jobDescription.trim() && 
                       configStatus.hasApiConfig && 
                       configStatus.hasRules && 
                       configStatus.hasRulesB && 
                       !isLoading && !isLoadingB;

    const getStatusMessage = () => {
        if (configStatus.isChecking) return 'Checking configuration...';
        if (!configStatus.hasApiConfig) return 'API configuration missing';
        if (!resume.trim() || !jobDescription.trim()) return 'Please fill in all fields';
        return 'Ready to evaluate';
    };

    return (
        <div className="flex flex-col gap-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Approach A Error: {error}
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearError}
                            className="ml-2 h-auto p-1 text-xs"
                        >
                            Dismiss
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {errorB && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Approach B Error: {errorB}
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearErrorB}
                            className="ml-2 h-auto p-1 text-xs"
                        >
                            Dismiss
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="flex justify-between items-center gap-3">
                <div className="text-sm text-muted-foreground text-center">
                    {getStatusMessage()}
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                    <Button 
                        onClick={handleStart}
                        disabled={!canStart || isLoading}
                        className="min-w-[110px] flex-1 max-w-[140px]"
                        variant="outline"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Running A...
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-1" />
                                Approach A
                            </>
                        )}
                    </Button>
                    
                    <Button 
                        onClick={handleStartB}
                        disabled={!canStartB || isLoadingB}
                        className="min-w-[110px] flex-1 max-w-[140px]"
                        variant="outline"
                    >
                        {isLoadingB ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Running B...
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-1" />
                                Approach B
                            </>
                        )}
                    </Button>

                    <Button 
                        onClick={handleStartBoth}
                        disabled={!canStartBoth || isLoading || isLoadingB}
                        className="min-w-[110px] flex-1 max-w-[140px]"
                        variant="outline"
                    >
                        {(isLoading && isLoadingB) ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Running All...
                            </>
                        ) : (isLoading || isLoadingB) ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            <>
                                <Zap className="h-4 w-4 mr-1" />
                                Both
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}