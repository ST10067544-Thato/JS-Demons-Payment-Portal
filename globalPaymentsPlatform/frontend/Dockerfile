# Stage 1: Build the React app
FROM node:16 AS build

# Set working directory with strict permissions
WORKDIR /app
RUN chmod -R 755 /app && \
    chown -R nobody:nobody /app

# 1. Copy package files (line 11 - no --chown, root-owned)
COPY package.json package-lock.json ./

# Install dependencies safely
RUN npm install --production --ignore-scripts --audit=false && \
    npm cache clean --force && \
    find node_modules/ -name "*.sh" -delete

# 2. Copy application files (lines 19-20 - no --chown)
COPY public/ public/
COPY src/ src/

# Build with nobody user
USER nobody
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Secure base image
RUN rm -rf /usr/share/nginx/html/* && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 555 /usr/share/nginx/html

# 3. Copy built assets (root-owned, read-only)
COPY --from=build /app/build /usr/share/nginx/html
RUN chmod -R 444 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type d -exec chmod 555 {} \;

USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]