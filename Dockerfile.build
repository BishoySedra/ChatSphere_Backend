# Use official Node.js image as the base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (adjust if different)
EXPOSE 3000

# Start the application "node index.js --environment dev"
CMD ["node", "index.js", "--environment", "dev"]