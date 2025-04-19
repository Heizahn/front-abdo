# Etapa de construcción
FROM node:22.14.0-alpine as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos del proyecto
COPY . .

# Los argumentos se pasarán desde Coolify
ARG VITE_HOST_API
ARG VITE_HOST_BCV
ARG VITE_HOST_API_G

# Crear archivo .env con las variables
RUN echo "VITE_HOST_API=${VITE_HOST_API}" > .env
RUN echo "VITE_HOST_BCV=${VITE_HOST_BCV}" >> .env
RUN echo "VITE_HOST_API_G=${VITE_HOST_API_G}" >> .env

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:22.14.0-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar los archivos de build
COPY --from=build /app/dist .

# Crear archivo de configuración para serve
RUN echo '{"rewrites": [{"source": "**", "destination": "/index.html"}]}' > serve.json

# Exponer el puerto
EXPOSE 80

# Iniciar el servidor con la configuración explícita para SPA
CMD ["serve", "-s", ".", "-l", "80", "--single"]