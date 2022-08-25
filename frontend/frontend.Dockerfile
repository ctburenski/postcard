FROM node
WORKDIR /app
COPY [ "./package.json", "./package-lock.json*", ".npmrc", "./"]
RUN npm ci 
COPY . .
RUN npm run build
