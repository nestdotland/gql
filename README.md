# Nest GraphQL API

Nest's (soon to be) official GraphQL API to query and mutate module data

> ### **NOTE:** _Nest GraphQL API is still under development and non-operational. Until official release, [x](https://github.com/nestdotland/x) is the official API._

## Getting started

1. Set the evvironment variables

   ```sh
   cp example.env .env.prod
   # and update the environmet variables
   ```

2. Start the Docker container

   ```sh
   docker-compose up
   ```

## Contributing

1. Install dependencies

   ```sh
   yarn install
   ```

2. Setup local database

   ```sh
   cp example.env .env
   docker-compose -f docker-compose.dev.yml up -d db
   ```

3. Create a `.env` file with the required variables

   ```json
   DATABASE_URL="postgresql://nest:nest@localhost:5432/nest?schema=public"
   PEPPER="development"
   GRAPHQL_PORT=4000
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
