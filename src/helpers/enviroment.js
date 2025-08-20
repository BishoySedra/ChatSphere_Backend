import { Command } from "commander";

/**
 * Configure and validate environment variable
 * @returns {string} The validated environment variable (dev|test|prod)
 */
export const configureEnvironmentVariable = () => {
  // If running in Jest test environment, default to 'test'
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    return 'test';
  }

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

  return environment;
};
