# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de tu código
COPY . .

# Expone el puerto en el que tu app escuchará
EXPOSE 3007

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
