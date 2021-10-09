# Setup
FROM node:16

# Build
COPY . .
RUN yarn install
RUN yarn build

# Start
CMD [ "yarn", "start" ]
