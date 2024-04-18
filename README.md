# ChatSphere

ChatSphere is a Full-Stack Chat Application Project built using ReactJS and NodeJS.

## API Documentation

For detailed information about the API endpoints and usage, please refer to the [API Documentation](https://documenter.getpostman.com/view/32763635/2sA35MzzRV#e48a33f9-b1ed-4b32-8e2e-304ab8320391).

## Steps to Run

Currently, there are three environments available: `dev`, `test`, and `local`.

To use a database, you must specify one of the available environments in your script. Here's how to do it:

- For testing:
  ```bash
  npm run dev -- --environment=test
  ```

- For development:
  ```bash
  npm run dev -- --environment=dev
  ```

Make sure to apply the same approach for other scripts like `npm test` or `npm start`.

### To Be Added

- For the local environment:
  ```bash
  npm run dev -- --environment=local
  ```

This command will be added for running the application in a local environment.
