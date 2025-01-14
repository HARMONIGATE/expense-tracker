FROM node:22.12.0-alpine AS build
WORKDIR /app
COPY package*.json tailwind.config.js ./
RUN npm install --legacy-peer-deps
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points
COPY . . 
RUN npm run build

FROM nginx:stable
COPY --from=build /app/dist/expense-tracker/browser /usr/share/nginx/html
EXPOSE 80
