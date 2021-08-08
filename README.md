# Nest GraphQL API

Nest's (soon to be) official GraphQL API to query and mutate module data

> ### **NOTE:** _Nest GraphQL API is still under development and non operational. Until official release, [x](https://github.com/nestdotland/x) is the official API._

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
3. 
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
4. Create a `.env` file with the required variables
```json
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestdotland?schema=public"
PEPPER="7+g+YpeiGJm564="
GRAPHQL_PORT=4000
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
