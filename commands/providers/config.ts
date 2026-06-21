import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.opencode');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export interface ProviderConfig {
  apiKey: string;
}

export interface Config {
  defaultProvider?: string;
  providers: {
    [providerName: string]: ProviderConfig;
  };
}

export function readConfig(): Config {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return { providers: {} };
    }
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data) as Config;
  } catch (error) {
    return { providers: {} };
  }
}

export function writeConfig(config: Config): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), {
      encoding: 'utf-8',
      mode: 0o600
    });
  } catch (error) {
    console.error("Error writing configuration file:", error);
  }
}

export function saveProviderCredentials(provider: string, apiKey: string): void {
  const config = readConfig();
  config.providers[provider] = { apiKey };
  if (!config.defaultProvider) {
    config.defaultProvider = provider;
  }
  writeConfig(config);
}

export function removeProviderCredentials(provider: string): boolean {
  const config = readConfig();
  if (!config.providers[provider]) {
    return false;
  }
  delete config.providers[provider];
  if (config.defaultProvider === provider) {
    const remaining = Object.keys(config.providers);
    config.defaultProvider = remaining.length > 0 ? remaining[0] : undefined;
  }
  writeConfig(config);
  return true;
}

export function setDefaultProvider(provider: string): boolean {
  const config = readConfig();
  // We can only set it as default if we are logged in
  if (!config.providers[provider]) {
    return false;
  }
  config.defaultProvider = provider;
  writeConfig(config);
  return true;
}
