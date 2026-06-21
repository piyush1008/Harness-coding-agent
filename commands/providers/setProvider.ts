import { Command } from 'commander';
import chalk from 'chalk';
import { setDefaultProvider } from './config';

export const setProviderCommand = new Command("setprovider")
    .description('Lets user set the default provider')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '')
    .action((options) => {
        const provider = options.provider?.trim();

        if (!provider) {
            console.error(chalk.red("Error: Please specify a provider using --provider <providerName>"));
            process.exit(1);
        }

        const success = setDefaultProvider(provider);
        if (success) {
            console.log(chalk.green(`Successfully set default provider to: ${provider}`));
        } else {
            console.error(chalk.red(`Error: Cannot set '${provider}' as default. You must login to this provider first.`));
            process.exit(1);
        }
    });
