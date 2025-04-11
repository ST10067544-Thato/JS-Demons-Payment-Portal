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

# Copy application code
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]