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

# Crear archivo .env con las variables
RUN echo "VITE_HOST_API=${VITE_HOST_API}" > .env
RUN echo "VITE_HOST_BCV=${VITE_HOST_BCV}" >> .env

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:22.14.0-alpine

WORKDIR /app

# Instalar un servidor web ligero
RUN npm install -g serve

# Copiar los archivos de build
COPY --from=build /app/dist .

# Exponer el puerto
EXPOSE 80

# Iniciar el servidor
CMD ["serve", "-s", ".", "-l", "80"]