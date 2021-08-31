# Setup
FROM node:14
WORKDIR /api

# Build
COPY . .
RUN yarn install
RUN yarn build

# Start
CMD [ "yarn", "start" ]
