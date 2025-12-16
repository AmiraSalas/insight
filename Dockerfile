# syntax = docker/dockerfile:1
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the built frontend from dist/public
COPY dist/public ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

