#!/usr/bin/env bun
import { program } from 'commander';
import { modelsCommand } from './commands/models';
import { agentCommand } from './commands/agent';
import { providerCommand } from './commands/providers';

program
  .name('opencode')
  .description('CLI for models')
  .version('0.8.0');


program
  .addCommand(modelsCommand)
  .addCommand(agentCommand)
  .addCommand(providerCommand);

program.parse();
