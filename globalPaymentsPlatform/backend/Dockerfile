# Use official Node.js image from Docker Hub as base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package.json package-lock.json ./

# Install project dependencies (including dotenv)
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app will run on
EXPOSE 5000

# Start the app using npm (using 'dev' script with nodemon)
CMD ["npm", "run", "dev"]
