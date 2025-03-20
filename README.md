# Kobizo Interview

## Description

Kobizo Interview is a NestJS-based project designed to handle backend services with support for configuration management, authentication via Supabase, and logging with Sentry.

## Test this API without setting up from local

Host: [https://kobizo-interview.fly.dev/swagger](https://kobizo-interview.fly.dev/swagger)
System account: system@tm.com - @Password123
Admin account: cannh.99+admin+1@gmail.com - @Password123
User account: cannh.99+user+1@gmail.com - @Password123

## Installation

Ensure you have `pnpm` installed, then run:

```sh
pnpm install
```

### Copy Environment File

Before running the application, copy the example environment file then fill it:

```sh
cp .env.example .env
```

## Setup database

### Install supabase cli

Following [this documentation](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos&queryGroups=access-method&access-method=studio)

### Deploy database changes

```sh
supabase db push
```

## Running the Application

### Development Mode

```sh
pnpm start:dev
```

### Run with Docker

```sh
docker build -t kobizo-interview .
```

```sh
docker run -d -p 3000:3000 --name kobizo-interview --env-file .env kobizo-interview
```

Change port 3000 to the port that you set in .env file

### Production Mode

```sh
pnpm build
pnpm start:prod
```

### Debug Mode

```sh
pnpm start:debug
```

## Setup default user

### Create system user

```sh
pnpm script script=create-system-user email=[admin-email] password=[password]
```

### Setup postman

Import collection and environment file from postman folder to Postman to test API

## Dependencies

- **NestJS**: Core framework.
- **Supabase**: Authentication and database.
- **Sentry**: Error tracking and logging.
- **Class-validator & Class-transformer**: For validation and transformation.
