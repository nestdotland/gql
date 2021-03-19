# Template

A template for nest.land repositories. Remove this sentence and change this header to describe the project this template is being used for.

## Getting started

TODO

## Running locally

1. Install dependencies
```sh
yarn install
```
2. Create a `nestdotland` pgSQL database
```sql
CREATE DATABASE nestdotland;
```
3. (Optional) Grant write and read access to the `postgres` user. Create a new one if needed
```sql
GRANT ALL ON ALL TABLES IN SCHEMA public TO "postgres";
```
4. Create a `.env` file with the required variables
```json
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestdotland?schema=public"
PEPPER="7+g+YpeiGJm564="
GRAPHQL_PORT=4000
MAX_QUERY_COMPLEXITY=1000
HOURLY_REQUEST_LIMIT=200
```
5. Create tables
```sh
yarn migrate init
```
6. Generate prisma & nexus files
```sh
yarn generate
```
7. Seed database
```sh
yarn seed
```
8. Run server
```
yarn dev
```

## Contributing

Instructions to quickly setup a dev environment to start contributing to the project.

## License

The contents of this repository are licensed under [The MIT license](LICENSE).
