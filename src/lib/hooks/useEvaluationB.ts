'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { EvaluateRequestB, EvaluateResponseB } from '@/app/api/v1/evaluate-b/route';

export interface EvaluationStateB {
  isLoading: boolean;
  result: EvaluateResponseB['data'] | null;
  error: string | null;
}

export interface EvaluationActionsB {
  startEvaluationB: (resume: string, jobDescription: string) => Promise<void>;
  clearResult: () => void;
  clearError: () => void;
}

interface EvaluationContextValueB extends EvaluationStateB, EvaluationActionsB {}

const EvaluationContextB = createContext<EvaluationContextValueB | undefined>(undefined);

export function EvaluationProviderB({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, setState] = useState<EvaluationStateB>({
    isLoading: false,
    result: null,
    error: null,
  });

  const startEvaluationB = useCallback(async (resume: string, jobDescription: string) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      result: null,
    }));

    try {
      // Load configuration and ruleset 2 from localStorage
      const { loadConfig, loadRuleset2 } = await import('@/lib/functions/storage');
      
      const apiConfig = loadConfig();
      const ruleset2Data = loadRuleset2();

      if (!apiConfig) {
        throw new Error('API configuration not found. Please configure your API key and provider.');
      }

      if (!ruleset2Data) {
        throw new Error('Approach B prompts not found. Please configure your system and user prompts.');
      }

      if (!ruleset2Data.systemPrompt?.trim() || !ruleset2Data.userPrompt?.trim()) {
        throw new Error('Both system prompt and user prompt are required for Approach B evaluation.');
      }

      const requestBody: EvaluateRequestB = {
        resume,
        jobDescription,
        apiConfig,
        prompts: {
          systemPrompt: ruleset2Data.systemPrompt,
          userPrompt: ruleset2Data.userPrompt
        },
        options: {
          temperature: 0.3,
        },
      };

      const response = await fetch('/api/v1/evaluate-b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: EvaluateResponseB = await response.json();
      console.log('Received Approach B evaluation response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Approach B evaluation failed');
      }

      console.log('Setting Approach B result state:', data.data);
      setState(prev => {
        const newState = {
          ...prev,
          isLoading: false,
          result: data.data || null,
        };
        console.log('New Approach B state after setting result:', newState);
        return newState;
      });

    } catch (error: unknown) {
      console.error('Approach B evaluation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const clearResult = useCallback(() => {
    setState(prev => ({
      ...prev,
      result: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return React.createElement(
    EvaluationContextB.Provider,
    {
      value: {
        ...state,
        startEvaluationB,
        clearResult,
        clearError,
      }
    },
    children
  );
}

export function useEvaluationB(): EvaluationContextValueB {
  const context = useContext(EvaluationContextB);
  if (context === undefined) {
    throw new Error('useEvaluationB must be used within an EvaluationProviderB');
  }
  return context;
}
