# Use official Node image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

# Expose your app port (check your app.js, usually 5000 or 3000)
EXPOSE 5000

# Start the server
CMD ["node", "src/app.js"]