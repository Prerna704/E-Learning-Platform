# 1. Lightweight Nginx image
FROM nginx:alpine

# 2. Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# 3. Copy all project files to nginx folder
COPY . /usr/share/nginx/html

# 4. Expose port 80
EXPOSE 80

# 5. Start nginx
CMD ["nginx", "-g", "daemon off;"]
