FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
# Using --legacy-peer-deps to resolve the known peer dependency conflict with date-fns
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose the React development server port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
