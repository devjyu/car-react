# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code and build the app
COPY . .
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:stable-alpine

# Copy the built app from the previous stage to the Nginx web server's directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration file (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]