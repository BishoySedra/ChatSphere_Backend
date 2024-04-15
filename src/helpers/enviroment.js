import { Command } from "commander";


export const configureEnviromentVariable = () => {
    // Create a new Commander program
  const program = new Command();

  // Define the required option for the environment variable
  program
    .requiredOption('--enviroment <(dev|test|local)>', 'Environment variable', /^(dev|test|local)$/);

  program.parse(process.argv);
  const { enviroment } = program.opts();
  if(enviroment !== "dev" && enviroment !== "test" && enviroment !== "local"){
    throw new Error("Invalid Environment Variable .. Cannot start DB!");
  }

  return enviroment
}
