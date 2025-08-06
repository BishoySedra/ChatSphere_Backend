import { Command } from "commander";


export const configureEnvironmentVariable = () => {
  // Create a new Commander program
  const program = new Command();

  // Define the required option for the environment variable
  program.requiredOption('--environment <(dev|test|prod)>', 'Environment variable', /^(dev|test|prod)$/);

  program.parse(process.argv);

  const { environment } = program.opts();

  const envs = ["dev", "test", "prod"];

  // Validate the environment variable
  if (!envs.includes(environment)) {
    console.error(`Invalid environment variable: ${environment}. Must be one of: ${envs.join(", ")}`);
    process.exit(1);
  }

  return environment
}
