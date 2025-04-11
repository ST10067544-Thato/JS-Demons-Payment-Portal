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

# Copy ONLY needed files/dirs (NO --chown, NO wildcard .)
COPY app.js server.js ./
COPY routes/ routes/
COPY middleWare/ middleWare/
COPY models/ models/
COPY db/ db/

# Set STRICT read-only permissions (no write access)
RUN chmod -R 444 /app && \          
    find /app -type d -exec chmod 555 {} \; && \  
    chmod 440 /app/db/config.js && \ 
    chmod 550 /app/db               

# Switch to non-root user (files still owned by root)
USER appuser

EXPOSE 5000
CMD ["node", "server.js"]