# Stage 1: Build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
# On pointe vers le dossier browser que tu viens de voir
COPY --from=build /app/dist/pmt-frontend/browser /usr/share/nginx/html

# Config pour éviter les erreurs 404 sur le refresh des pages Angular
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
