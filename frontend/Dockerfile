FROM oven/bun:1.3.2

WORKDIR /app

# Copy only package.json & bun.lockb first for caching
COPY package.json bun.lockb* ./

# Install dependencies once
RUN bun install --no-audit --no-fund

# Copy the rest of the app
COPY . .

EXPOSE 5173

CMD ["bun", "run", "dev", "--", "--host", "0.0.0.0"]
