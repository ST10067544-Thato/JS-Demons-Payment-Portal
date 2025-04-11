FROM node:16

# Create non-root user
RUN useradd -m appuser

# Set working directory
WORKDIR /app

# Copy package files first (as root)
COPY package.json package-lock.json ./

# Install production dependencies (as root)
RUN npm install --production && \
    npm cache clean --force

# Copy application files (as root)
COPY . .

# Fix permissions:
# - Give appuser read access to all files
# - Remove write permissions globally
RUN chown -R appuser:appuser /app && \
    chmod -R 550 /app && \          
    chmod 640 /app/db/config.js && \ 
    chmod -R 750 /app/db           

# Switch to non-root user
USER appuser

EXPOSE 5000
CMD ["node", "server.js"]