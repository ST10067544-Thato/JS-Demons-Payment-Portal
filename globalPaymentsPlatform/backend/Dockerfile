FROM node:16

# Create non-root user (reduce privilege escalation risk)
RUN useradd -m appuser && \
    mkdir -p /app && \
    chown -R appuser:appuser /app

# Set working directory (safe ownership already set)
WORKDIR /app

# 1. Copy ONLY package files (no scripts executed yet)
COPY package.json package-lock.json ./

# 2. Install production dependencies SAFELY
RUN npm install --production --ignore-scripts --audit=false && \
    npm cache clean --force && \
    rm -rf /tmp/*

# 3. Copy application files (read-only)
COPY app.js server.js ./
COPY routes/ routes/
COPY middleWare/ middleWare/
COPY models/ models/
COPY db/ db/

# 4. Lock down permissions (no write access)
RUN chmod -R 444 /app && \
    find /app -type d -exec chmod 555 {} \; && \
    chmod 440 /app/db/config.js && \
    chmod 550 /app/db

# 5. Verify no dangerous scripts remain
RUN find node_modules/ -name "*.sh" -delete && \
    find node_modules/ -name "*.exe" -delete

# Switch to non-root user
USER appuser

EXPOSE 5000
CMD ["node", "server.js"]