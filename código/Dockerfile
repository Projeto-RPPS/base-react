# Usa Node 20 LTS
FROM node:20-alpine

WORKDIR /app

# Copia manifestos e instala deps
COPY package.json package-lock.json ./
RUN npm ci

# Copia todo o código-fonte
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# Inicia em modo dev (hot-reload)
CMD ["npm", "run", "dev"]