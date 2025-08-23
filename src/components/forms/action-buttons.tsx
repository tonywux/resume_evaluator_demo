'use client';

import { Button } from "@/components/ui/button"
import { useInputs } from "@/lib/hooks/useInputs"
import { useEvaluation } from "@/lib/hooks/useEvaluation"
import { AlertCircle, Play, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loadConfig, hasConfig, hasRuleset } from "@/lib/functions/storage"
import { useEffect, useState } from "react"

export default function ActionButtons() {
    const { resume, jobDescription } = useInputs();
    const { isLoading, startEvaluation, error, clearError } = useEvaluation();
    const [configStatus, setConfigStatus] = useState({
        hasApiConfig: false,
        hasRules: false,
        isChecking: true
    });

    // Check configuration status on mount and when localStorage changes
    useEffect(() => {
        const checkConfig = () => {
            setConfigStatus({
                hasApiConfig: hasConfig(),
                hasRules: hasRuleset(),
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

    const canStart = resume.trim() && 
                   jobDescription.trim() && 
                   configStatus.hasApiConfig && 
                   configStatus.hasRules && 
                   !isLoading;

    const getStatusMessage = () => {
        if (configStatus.isChecking) return 'Checking configuration...';
        if (!configStatus.hasApiConfig) return 'API configuration missing';
        if (!configStatus.hasRules) return 'Evaluation rules missing';
        if (!resume.trim() || !jobDescription.trim()) return 'Please fill in all fields';
        return 'Ready to evaluate';
    };

    return (
        <div className="flex flex-col gap-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
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
            
            <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    {getStatusMessage()}
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={handleStart}
                        disabled={!canStart || isLoading}
                        className="min-w-[100px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Evaluating...
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}