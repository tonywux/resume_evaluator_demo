'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InputState {
  resume: string;
  jobDescription: string;
}

interface InputActions {
  setResume: (resume: string) => void;
  setJobDescription: (jobDescription: string) => void;
  clearInputs: () => void;
}

interface InputContextValue extends InputState, InputActions {}

const InputContext = createContext<InputContextValue | undefined>(undefined);

export function InputProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const clearInputs = () => {
    setResume('');
    setJobDescription('');
  };

  return (
    <InputContext.Provider
      value={{
        resume,
        jobDescription,
        setResume,
        setJobDescription,
        clearInputs,
      }}
    >
      {children}
    </InputContext.Provider>
  );
}

export function useInputs(): InputContextValue {
  const context = useContext(InputContext);
  if (context === undefined) {
    throw new Error('useInputs must be used within an InputProvider');
  }
  return context;
}
