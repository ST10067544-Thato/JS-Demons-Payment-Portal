# Stage 1: Build the React app
FROM node:16 AS build

# Set working directory with strict permissions
WORKDIR /app

# Use existing node user (UID 1000) and set proper permissions
RUN chmod -R 755 /app && \
    chown -R node:node /app

# Set npm config to use tmp directory
ENV NPM_CONFIG_CACHE=/tmp/.npm \
    NPM_CONFIG_PREFIX=/tmp/.npm

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies safely
RUN npm install --production --ignore-scripts --audit=false && \
    npm cache clean --force && \
    find node_modules/ -name "*.sh" -delete

# Copy application files
COPY public/ public/
COPY src/ src/

# Build with non-root user
USER node
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Secure base image
RUN rm -rf /usr/share/nginx/html/* && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 555 /usr/share/nginx/html

# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html
RUN chmod -R 444 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type d -exec chmod 555 {} \;

USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]