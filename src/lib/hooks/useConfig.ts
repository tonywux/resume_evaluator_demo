"use client"

import { useState, useEffect } from 'react';
import { loadConfig, saveConfig, clearConfig, hasConfig, isBrowser, ApiConfig } from '@/lib/functions/storage';

/**
 * Custom hook for managing user configuration with localStorage
 */
export function useConfig() {
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load config on mount
  useEffect(() => {
    if (isBrowser()) {
      try {
        const savedConfig = loadConfig();
        setConfig(savedConfig);
        setError(null);
      } catch (err) {
        setError('Failed to load configuration');
        console.error('Error loading config:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const saveUserConfig = async (newConfig: ApiConfig): Promise<void> => {
    if (!isBrowser()) {
      throw new Error('Cannot save config in server environment');
    }

    try {
      saveConfig(newConfig);
      setConfig(newConfig);
      setError(null);
    } catch (err) {
      const errorMessage = 'Failed to save configuration';
      setError(errorMessage);
      console.error('Error saving config:', err);
      throw new Error(errorMessage);
    }
  };

  const clearUserConfig = async (): Promise<void> => {
    if (!isBrowser()) {
      throw new Error('Cannot clear config in server environment');
    }

    try {
      clearConfig();
      setConfig(null);
      setError(null);
    } catch (err) {
      const errorMessage = 'Failed to clear configuration';
      setError(errorMessage);
      console.error('Error clearing config:', err);
      throw new Error(errorMessage);
    }
  };

  const hasUserConfig = (): boolean => {
    if (!isBrowser()) return false;
    return hasConfig();
  };

  return {
    config,
    isLoading,
    error,
    saveConfig: saveUserConfig,
    clearConfig: clearUserConfig,
    hasConfig: hasUserConfig,
    isConfigured: config !== null && config.provider !== '' && config.key !== '',
  };
}
