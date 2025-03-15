# Usa una imagen base de node
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Instalar crypto-browserify (si no está en el package.json)
RUN npm install crypto-browserify

# Construir el proyecto
RUN npm run build

# Usar una imagen más ligera para el servidor
FROM nginx:alpine

# Copiar los archivos construidos a la imagen de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto
EXPOSE 80

# Comando para iniciar el servidor
CMD ["nginx", "-g", "daemon off;"]