import { Command } from "commander";
import chalk from "chalk";
import { readConfig } from "./providers/config";

// Interface for API handlers
interface ProviderHandler {
  url: string;
  headers: (apiKey: string) => Record<string, string>;
  body: (prompt: string) => any;
  parseResponse: (json: any) => string;
}

const PROVIDERS: Record<string, ProviderHandler> = {
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    }),
    body: (prompt) => ({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
    parseResponse: (json) => {
      if (json.error) {
        throw new Error(json.error.message || JSON.stringify(json.error));
      }
      return json.choices?.[0]?.message?.content || "";
    },
  },
  claude: {
    url: "https://api.anthropic.com/v1/messages",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    }),
    body: (prompt) => ({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
    parseResponse: (json) => {
      if (json.error) {
        throw new Error(json.error.message || JSON.stringify(json.error));
      }
      return json.content?.[0]?.text || "";
    },
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    headers: () => ({
      "Content-Type": "application/json",
    }),
    body: (prompt) => ({
      contents: [{
        parts: [{ text: prompt }]
      }]
    }),
    parseResponse: (json) => {
      if (json.error) {
        throw new Error(json.error.message || JSON.stringify(json.error));
      }
      return json.candidates?.[0]?.content?.parts?.[0]?.text || "";
    },
  }
};

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    const prompt = options.prompt?.trim();
    if (!prompt) {
      console.error(chalk.red("Error: Please specify a prompt using --prompt <prompt>"));
      process.exit(1);
    }

    const config = readConfig();
    const providerName = config.defaultProvider;

    if (!providerName) {
      console.error(chalk.red("Error: No active provider set. Please login first:"));
      console.error(chalk.yellow("  bun cli.ts providers login --provider <providerName> --api_key <apiKey>"));
      process.exit(1);
    }

    const providerConfig = config.providers[providerName];
    if (!providerConfig || !providerConfig.apiKey) {
      console.error(chalk.red(`Error: No API key found for provider '${providerName}'. Please login again.`));
      process.exit(1);
    }

    const handler = PROVIDERS[providerName.toLowerCase()];
    if (!handler) {
      console.error(chalk.red(`Error: Provider '${providerName}' is not supported by the agent.`));
      process.exit(1);
    }

    console.log(chalk.blue(`Querying ${providerName}...`));

    try {
      let url = handler.url;
      if (providerName.toLowerCase() === "gemini") {
        url = `${url}?key=${providerConfig.apiKey}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: handler.headers(providerConfig.apiKey),
        body: JSON.stringify(handler.body(prompt)),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errJson: any = {};
        try {
          errJson = JSON.parse(errText);
        } catch {}
        const errMsg = errJson?.error?.message || errText || response.statusText;
        throw new Error(errMsg);
      }

      const json = await response.json();
      const answer = handler.parseResponse(json);

      console.log(chalk.green("\nResponse:"));
      console.log(answer);
    } catch (error: any) {
      console.error(chalk.red(`\nError: Failed to query ${providerName}`));
      console.error(chalk.red(error.message || error));
      process.exit(1);
    }
  });