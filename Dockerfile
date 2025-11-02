# Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# ARG para receber a URL da API
ARG VITE_API_URL=http://localhost:3001/api

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build de produção com a variável de ambiente
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Stage de produção com nginx
FROM nginx:alpine

# Copiar build para nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configurar nginx inline para SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

