
import { Command } from 'commander';
import chalk from 'chalk';
import { removeProviderCredentials } from './config';

export const logoutCommand = new Command("logout")
    .description('Lets user logout from the provider')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '')
    .action((options) => {
        const provider = options.provider?.trim();

        if (!provider) {
            console.error(chalk.red("Error: Please specify a provider using --provider <providerName>"));
            process.exit(1);
        }

        const success = removeProviderCredentials(provider);
        if (success) {
            console.log(chalk.green(`Successfully logged out of provider: ${provider}`));
        } else {
            console.log(chalk.yellow(`Warning: You were not logged into provider: ${provider}`));
        }
    });
