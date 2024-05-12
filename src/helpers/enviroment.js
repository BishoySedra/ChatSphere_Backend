import { Command } from "commander";


export const configureEnvironmentVariable = () => {
    // Create a new Commander program
  const program = new Command();

  // Define the required option for the environment variable
  program
    .requiredOption('--environment <(dev|test|local)>', 'Environment variable', /^(dev|test|local)$/);

  program.parse(process.argv);
  const { environment } = program.opts();
  if(environment !== "dev" && environment !== "test" && environment !== "local"){
    throw new Error("Invalid Environment Variable .. Cannot start DB!");
  }

  return environment
}
