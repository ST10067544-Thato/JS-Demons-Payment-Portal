FROM node:16

# Create non-root user
RUN useradd -m appuser

# Set working directory
WORKDIR /app

# 1. First copy ONLY package files (safe)
COPY package.json package-lock.json ./

# 2. Install production dependencies
RUN npm install --production && \
    npm cache clean --force

# 3. COPY ONLY NEEDED DIRECTORIES (not wildcard .)
COPY --chown=appuser:appuser app.js server.js ./
COPY --chown=appuser:appuser routes/ routes/
COPY --chown=appuser:appuser middleWare/ middleWare/
COPY --chown=appuser:appuser models/ models/
COPY --chown=appuser:appuser db/ db/

# 4. Set SAFE permissions (read-only for appuser)
RUN chmod -R 550 /app && \          
    chmod 640 /app/db/config.js && \ 
    chmod 750 /app/db               

# Switch to non-root user
USER appuser

EXPOSE 5000
CMD ["node", "server.js"]