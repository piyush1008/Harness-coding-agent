import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { saveProviderCredentials } from './config';

function getSupportedProviders(): string[] {
  try {
    const data = fs.readFileSync(path.join(process.cwd(), 'commands/provider.txt'), 'utf-8');
    return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  } catch (error) {
    return ['openai', 'claude', 'gemini'];
  }
}

export const loginCommand = new Command("login")
    .description('Lets user login into the provider (use it as default)')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '')
    .option('-a, --api_key <apiKey>', 'Your api key', '')
    .action((options) => {
        const provider = options.provider?.trim();
        const apiKey = (options.apiKey || options.api_key || '')?.trim();

        if (!provider) {
            console.error(chalk.red("Error: Please specify a provider using --provider <providerName>"));
            process.exit(1);
        }

        const supported = getSupportedProviders();
        if (!supported.includes(provider)) {
            console.error(chalk.red(`Error: Provider '${provider}' is not supported.`));
            console.error(chalk.yellow(`Supported providers are: ${supported.join(', ')}`));
            process.exit(1);
        }

        if (!apiKey) {
            console.error(chalk.red("Error: Please specify your API key using --api_key <apiKey>"));
            process.exit(1);
        }

        saveProviderCredentials(provider, apiKey);
        console.log(chalk.green(`Successfully logged into provider: ${provider}`));
    });
