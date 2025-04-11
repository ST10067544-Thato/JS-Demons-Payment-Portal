# Stage 1: Build the React app
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies (clean cache afterwards)
RUN npm install --production && \
    npm cache clean --force

# Copy only necessary files for build
COPY public/ public/
COPY src/ src/

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Switch to non-root user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Copy built assets from build stage
COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html

# Switch to nginx user
USER nginx

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]