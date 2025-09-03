/**
 * Browser localStorage API for managing user configuration
 */

export interface ApiConfig {
  provider: string;
  key: string;
}

export interface Rule {
  id: string;
  description: string;
  weight: number;
}

export interface BlacklistConfig {
  companyBlacklistEnabled: boolean;
  companyBlacklist: string;
  degreeBlacklistEnabled: boolean;
  degreeBlacklist: string;
}

export interface RulesetData {
  evaluationRules: Rule[];
  blacklist: BlacklistConfig;
}

export interface Ruleset2Data {
  systemPrompt: string;
  userPrompt: string;
}

const CONFIG_STORAGE_KEY = 'llm_config';
const RULESET_STORAGE_KEY = 'evaluation_ruleset';
const RULESET2_STORAGE_KEY = 'evaluation_ruleset_2';

/**
 * Save user configuration to localStorage
 */
export function saveConfig(config: ApiConfig): void {
  try {
    const configString = JSON.stringify(config);
    localStorage.setItem(CONFIG_STORAGE_KEY, configString);
  } catch (error) {
    console.error('Failed to save config to localStorage:', error);
    throw new Error('Failed to save configuration');
  }
}

/**
 * Load user configuration from localStorage
 */
export function loadConfig(): ApiConfig | null {
  try {
    const configString = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!configString) {
      return null;
    }
    
    const config = JSON.parse(configString) as ApiConfig;
    
    // Validate the loaded config structure
    if (typeof config.provider !== 'string' || typeof config.key !== 'string') {
      console.warn('Invalid config structure in localStorage, clearing...');
      clearConfig();
      return null;
    }
    
    return config;
  } catch (error) {
    console.error('Failed to load config from localStorage:', error);
    // Clear corrupted data
    clearConfig();
    return null;
  }
}

/**
 * Clear user configuration from localStorage
 */
export function clearConfig(): void {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear config from localStorage:', error);
    throw new Error('Failed to clear configuration');
  }
}

/**
 * Check if configuration exists in localStorage
 */
export function hasConfig(): boolean {
  try {
    return localStorage.getItem(CONFIG_STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check config existence:', error);
    return false;
  }
}

/**
 * Save ruleset data to localStorage
 */
export function saveRuleset(ruleset: RulesetData): void {
  try {
    const rulesetString = JSON.stringify(ruleset);
    localStorage.setItem(RULESET_STORAGE_KEY, rulesetString);
  } catch (error) {
    console.error('Failed to save ruleset to localStorage:', error);
    throw new Error('Failed to save ruleset');
  }
}

/**
 * Load ruleset data from localStorage
 */
export function loadRuleset(): RulesetData | null {
  try {
    const rulesetString = localStorage.getItem(RULESET_STORAGE_KEY);
    if (!rulesetString) {
      return null;
    }
    
    const ruleset = JSON.parse(rulesetString) as RulesetData;
    
    // Validate the loaded ruleset structure
    if (!ruleset.evaluationRules || !Array.isArray(ruleset.evaluationRules) || !ruleset.blacklist) {
      console.warn('Invalid ruleset structure in localStorage, clearing...');
      clearRuleset();
      return null;
    }
    
    return ruleset;
  } catch (error) {
    console.error('Failed to load ruleset from localStorage:', error);
    // Clear corrupted data
    clearRuleset();
    return null;
  }
}

/**
 * Clear ruleset data from localStorage
 */
export function clearRuleset(): void {
  try {
    localStorage.removeItem(RULESET_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear ruleset from localStorage:', error);
    throw new Error('Failed to clear ruleset');
  }
}

/**
 * Check if ruleset exists in localStorage
 */
export function hasRuleset(): boolean {
  try {
    return localStorage.getItem(RULESET_STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check ruleset existence:', error);
    return false;
  }
}

/**
 * Save ruleset2 data to localStorage
 */
export function saveRuleset2(ruleset2: Ruleset2Data): void {
  try {
    const ruleset2String = JSON.stringify(ruleset2);
    localStorage.setItem(RULESET2_STORAGE_KEY, ruleset2String);
  } catch (error) {
    console.error('Failed to save ruleset2 to localStorage:', error);
    throw new Error('Failed to save ruleset2');
  }
}

/**
 * Load ruleset2 data from localStorage
 */
export function loadRuleset2(): Ruleset2Data | null {
  try {
    const ruleset2String = localStorage.getItem(RULESET2_STORAGE_KEY);
    if (!ruleset2String) {
      return null;
    }
    
    const ruleset2 = JSON.parse(ruleset2String) as Ruleset2Data;
    
    // Validate the loaded ruleset2 structure
    if (typeof ruleset2.systemPrompt !== 'string' || typeof ruleset2.userPrompt !== 'string') {
      console.warn('Invalid ruleset2 structure in localStorage, clearing...');
      clearRuleset2();
      return null;
    }
    
    return ruleset2;
  } catch (error) {
    console.error('Failed to load ruleset2 from localStorage:', error);
    // Clear corrupted data
    clearRuleset2();
    return null;
  }
}

/**
 * Clear ruleset2 data from localStorage
 */
export function clearRuleset2(): void {
  try {
    localStorage.removeItem(RULESET2_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear ruleset2 from localStorage:', error);
    throw new Error('Failed to clear ruleset2');
  }
}

/**
 * Check if ruleset2 exists in localStorage
 */
export function hasRuleset2(): boolean {
  try {
    return localStorage.getItem(RULESET2_STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check ruleset2 existence:', error);
    return false;
  }
}

/**
 * Utility hook for checking if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}
