# Use official Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install

# Copy project files
COPY . /app/

# Expose port for React frontend
EXPOSE 3000

# Start React app
CMD ["npm", "start"]
