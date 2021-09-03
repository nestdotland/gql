# Setup
FROM node:14

# Build
COPY . .
RUN yarn install
RUN yarn build

# Start
CMD [ "yarn", "start" ]
