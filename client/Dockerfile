# Use the official Node.js image as the base
FROM node:22-alpine

# Set the working directory
WORKDIR /user/src/client

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Start the Next.js server
CMD ["npm", "start"]
