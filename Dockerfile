FROM nginx:alpine

# Copy nginx config first (smaller layer)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
WORKDIR /usr/share/nginx/html
COPY dist/public ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




