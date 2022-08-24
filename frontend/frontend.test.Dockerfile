FROM node
WORKDIR /app
COPY [ "./package.json", "./package-lock.json*", ".npmrc", "./"]
RUN npm install
COPY . .
RUN npm run build
