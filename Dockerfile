# Usa una versión ligera de Node
FROM node:22-alpine AS builder

# Directory of work
WORKDIR /app

# Copy the dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate the Prisma client
RUN npm install
RUN npx prisma generate

# Copy the rest of the code
COPY . .

# Compila el proyecto
RUN npm run build

# Final image
FROM node:22-alpine
WORKDIR /app

# Instalar openssl (necesario para Prisma en Alpine)
RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Exposes the API port
EXPOSE 3000

# Comando para desarrollo (con hot-reload)
CMD ["npm", "run", "start:dev"]