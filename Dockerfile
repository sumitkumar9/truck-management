# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Generate Prisma client (optional but recommended)
RUN npx prisma generate

# Build NestJS (compile TypeScript)
RUN npm run build

# Expose application port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]
