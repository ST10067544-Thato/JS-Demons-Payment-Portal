FROM node:16

# Create non-root user
RUN useradd -m appuser

# Set working directory and permissions
WORKDIR /app
RUN chown -R appuser:appuser /app

# Copy package files first (optimization)
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm install --include=dev

# Switch to non-root user
USER appuser

# Copy ONLY what’s needed (safer than `COPY . .`)
COPY --chown=appuser:appuser src/ src/
COPY --chown=appuser:appuser public/ public/
COPY --chown=appuser:appuser *.js ./

EXPOSE 5000
CMD ["npm", "run", "dev"]