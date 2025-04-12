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

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:22.14.0-alpine as production

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar solo dependencias de producción
RUN npm ci --production

# Copiar los archivos de build desde la etapa anterior
COPY --from=build /app/dist ./dist

# Exponer el puerto que utilizará la aplicación
EXPOSE 4173

# Comando para iniciar la aplicación en modo preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]