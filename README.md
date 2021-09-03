# Nest GraphQL API

Nest's (soon to be) official GraphQL API to query and mutate module data

> ### **NOTE:** _Nest GraphQL API is still under development and non-operational. Until official release, [x](https://github.com/nestdotland/x) is the official API._

## Getting started

1. Set the evvironment variables

   ```sh
   cp example.env .env.prod
   # and update the environment variables
   ```

2. Start the Docker container

   ```sh
   docker-compose up
   ```

## Contributing

1. Setup local database

   ```sh
   docker-compose -f docker-compose.dev.yml up -d db
   ```

2. Create a `.env` file and update it with the required variables

   ```sh
   cp example.env .env
   ```

3. Install dependencies

   ```sh
   yarn install
   ```

4. Build

   ```sh
   yarn build
   ```

5. Run server

   ```
   yarn dev
   ```

## License

The contents of this repository are licensed under [The MIT license](LICENSE).
