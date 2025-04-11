# Stage 1: Build the React app (with security hardening)
FROM node:16 AS build

# Set working directory with safe permissions
WORKDIR /app
RUN chown -R nobody:nobody /app && \
    chmod -R 755 /app

# Copy package files first (as nobody user)
USER nobody
COPY --chown=nobody:nobody package.json package-lock.json ./

# Install dependencies SAFELY (no script execution)
RUN npm install --production --ignore-scripts --audit=false && \
    npm cache clean --force && \
    find node_modules/ -name "*.sh" -delete

# Copy only necessary files (as nobody)
COPY --chown=nobody:nobody public/ public/
COPY --chown=nobody:nobody src/ src/

# Build the app (still as nobody)
RUN npm run build

# Stage 2: Serve with nginx (locked down)
FROM nginx:alpine

# Remove default files and secure permissions
RUN rm -rf /usr/share/nginx/html/* && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 555 /usr/share/nginx/html && \          
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid && \
    chmod 444 /etc/nginx/nginx.conf                 

# Copy built assets (no --chown, root-owned by default)
COPY --from=build /app/build /usr/share/nginx/html

# Final permission lockdown
RUN find /usr/share/nginx/html -type f -exec chmod 444 {} \; && \
    find /usr/share/nginx/html -type d -exec chmod 555 {} \;

# Switch to nginx user
USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]