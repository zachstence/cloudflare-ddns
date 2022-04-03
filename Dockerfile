FROM mhart/alpine-node:16

WORKDIR /app
COPY . .

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

RUN ls

# Run
ENV NODE_ENV=production
CMD ["npm", "start"]
