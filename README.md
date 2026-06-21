# opencode CLI

`opencode` is a command-line interface (CLI) tool designed for managing AI models, providers, and running agent actions.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation & Running](#installation--running)
- [Configuration](#configuration)
- [Usage & Commands](#usage--commands)
  - [Provider Commands (`providers`)](#provider-commands-providers)
  - [Model Commands (`models`)](#model-commands-models)
  - [Agent Commands (`agent`)](#agent-commands-agent)

---

## Prerequisites
* [Bun](https://bun.sh/) runtime installed.

---

## Installation & Running

Clone the repository and install the dependencies:
```bash
bun install
```

To execute the CLI, run:
```bash
bun cli.ts [command] [options]
```

---

## Configuration
Credentials and settings are securely stored in the current user's home directory:
* **Path:** `~/.opencode/config.json`
* **File Permissions:** Restricted to owner read/write (`mode: 600`).

Example configuration:
```json
{
  "providers": {
    "openai": {
      "apiKey": "sk-proj-..."
    }
  },
  "defaultProvider": "openai"
}
```

---

## Usage & Commands

### Provider Commands (`providers`)
Manage active providers and API keys.

#### 1. Login to a Provider
Saves credentials and sets the provider as default if none is set. Supported providers are configured in `commands/provider.txt` (e.g., `openai`, `claude`).
```bash
bun cli.ts providers login --provider <providerName> --api_key <apiKey>
```
* **Options:**
  * `-p, --provider <providerName>`: Name of the provider (e.g., `openai`, `claude`).
  * `-a, --api_key <apiKey>`: Your API key.

#### 2. Set Default Provider
Selects which provider to use by default. You must be logged into the provider first.
```bash
bun cli.ts providers setprovider --provider <providerName>
```
* **Options:**
  * `-p, --provider <providerName>`: Name of the provider to make default.

#### 3. Logout of a Provider
Clears saved credentials for a specific provider.
```bash
bun cli.ts providers logout --provider <providerName>
```
* **Options:**
  * `-p, --provider <providerName>`: Name of the provider.

---

### Model Commands (`models`)
List the models supported by the CLI. Supported models are listed in `commands/model.txt`.

```bash
bun cli.ts models [options]
```
* **Options:**
  * `-m, --model <modelName>`: Specific model name to search/inspect (default: `all`).

---

### Agent Commands (`agent`)
Runs the agent engine with the specified prompt.

```bash
bun cli.ts agent [options]
```
* **Options:**
  * `-p, --prompt <prompt>`: The text prompt or instructions to feed to the agent.
