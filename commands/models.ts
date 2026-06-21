import { Command } from "commander";
import fs from "fs";
export const modelsCommand = new Command("models")
  .description('Returns all the supported models')
  .option('-m, --model <modelName>', 'name of the model', 'all')
  .action((options) => {
    console.log("Listing models...");
    const data = fs.readFileSync("commands/model.txt", "utf-8")
    console.log(data)
  });