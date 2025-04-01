# Hono Tasks Backend

## Overview

Hono Tasks Backend is a Node.js-based task management API built with [Hono](https://hono.dev/). It uses **Drizzle ORM** for database migrations and interactions, and **Scalar OpenAPI** for documentation. Authentication is required to access all endpoints, ensuring secure task management.

## Features

- **Authentication:** Users must be authenticated to create, read, update, or delete tasks.
- **Database Management:** Uses **Drizzle ORM** to handle migrations and queries.
- **API Documentation:** OpenAPI documentation is generated using **Scalar**.
- **Logging:** Uses **pino** and **hono-pino** for efficient logging.
- **Environment Configuration:** Managed using **dotenv** and **dotenv-expand**.

<p align="center">
   <img src="https://github.com/sk-bittok/tasks-auth/blob/main/assets/tasks-api-auth.png", width="400">
</p>

## Technologies Used

- **Node.js** (TypeScript)
- **Hono** (Web framework)
- **Drizzle ORM** (Database ORM)
- **PostgreSQL** (Database)
- **Zod** (Schema validation)
- **Argon2** (Password hashing)
- **Pino** (Logging)

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** (Installed and running)
- **pnpm** (Package manager)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/tasks-auth.git
   cd tasks-auth
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure database connection and other environment settings
4. Run database migrations:
   ```sh
   pnpm drizzle-kit migrate
   ```
5. Start the development server:
   ```sh
   pnpm dev
   ```

## API Documentation

API documentation is generated using **Scalar OpenAPI** and can be accessed at:

```
http://localhost:3000/docs
```

## Scripts

- `dev`: Start the development server with hot reloading.
- `lint`: Run Biome for linting and formatting.
- `format`: Auto-format code using Biome.
- `drizzle-kit push`: Apply database migrations.

## Project Structure

```
├── src/
│   ├── index.ts        # Main entry point
│   ├── routes/         # API routes
│   ├── db/             # Database models and migrations
│   ├── middlewares/    # Authentication and logging
│   ├── lib/            # Helper functions
│   └── env.ts          # Env Configuration settings
└── README.md
```

## License

This project is licensed under the MIT License.

