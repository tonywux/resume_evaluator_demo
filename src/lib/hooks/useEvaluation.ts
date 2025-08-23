'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { EvaluateRequest, EvaluateResponse } from '@/app/api/v1/evaluate/route';

export interface EvaluationState {
  isLoading: boolean;
  result: EvaluateResponse['data'] | null;
  error: string | null;
}

export interface EvaluationActions {
  startEvaluation: (resume: string, jobDescription: string) => Promise<void>;
  clearResult: () => void;
  clearError: () => void;
}

interface EvaluationContextValue extends EvaluationState, EvaluationActions {}

const EvaluationContext = createContext<EvaluationContextValue | undefined>(undefined);

export function EvaluationProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, setState] = useState<EvaluationState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const startEvaluation = useCallback(async (resume: string, jobDescription: string) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      result: null,
    }));

    try {
      // Load configuration and rules from localStorage
      const { loadConfig, loadRuleset } = await import('@/lib/functions/storage');
      
      const apiConfig = loadConfig();
      const rulesetData = loadRuleset();

      if (!apiConfig) {
        throw new Error('API configuration not found. Please configure your API key and provider.');
      }

      if (!rulesetData) {
        throw new Error('Evaluation rules not found. Please configure your evaluation rules.');
      }

      const requestBody: EvaluateRequest = {
        resume,
        jobDescription,
        apiConfig,
        rules: rulesetData,
        options: {
          temperature: 0.3,
        },
      };

      const response = await fetch('/api/v1/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: EvaluateResponse = await response.json();
      console.log('Received evaluation response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Evaluation failed');
      }

      console.log('Setting result state:', data.data);
      setState(prev => {
        const newState = {
          ...prev,
          isLoading: false,
          result: data.data || null,
        };
        console.log('New state after setting result:', newState);
        return newState;
      });

    } catch (error: unknown) {
      console.error('Evaluation error:', error);
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
    EvaluationContext.Provider,
    {
      value: {
        ...state,
        startEvaluation,
        clearResult,
        clearError,
      }
    },
    children
  );
}

export function useEvaluation(): EvaluationContextValue {
  const context = useContext(EvaluationContext);
  if (context === undefined) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
}
