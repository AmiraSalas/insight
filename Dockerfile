# syntax = docker/dockerfile:1
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the built frontend only
COPY client/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

