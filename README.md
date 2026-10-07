# Boltyy

Boltyy is an AI-assisted React application builder. A user describes an app, Google Gemini generates the project files, and the generated application opens in a browser-based workspace with a code editor and live preview.

> [!NOTE]
> This repository is currently a prototype. The core generation and workspace experience is implemented, while the publishing flow and production security model still need further integration and hardening.

## Features

- Generate React applications from a natural-language prompt with Gemini
- Sign in with Google OAuth
- Persist users, workspaces, chat messages, and generated files in PostgreSQL
- Browse and edit generated files with CodeSandbox Sandpack
- Preview generated applications directly in the browser
- Reopen previous workspaces from the sidebar
- Build Vite projects and publish static output to Amazon S3 and CloudFront

## Architecture

This repository is an npm workspaces monorepo:

```text
.
├── apps/
│   ├── api/             Express and TypeScript API
│   └── web/             Next.js web application
├── packages/
│   ├── config/          Shared server configuration
│   └── shared/          Shared TypeScript types
├── package.json
└── tsconfig.base.json
```

The main application flow is:

1. The user signs in with Google.
2. The web app sends the user's prompt to the API.
3. Gemini returns a JSON description of the generated React files.
4. The API stores the workspace, prompt, and generated files in PostgreSQL.
5. The workspace loads those files into Sandpack for editing and previewing.

## Technology stack

### Web

- Next.js 16 and React 19
- Tailwind CSS 4
- CodeSandbox Sandpack
- Radix UI primitives
- Google OAuth
- Axios

### API

- Express 5 and TypeScript
- Google Gemini 2.5 Flash
- Drizzle ORM
- Neon serverless PostgreSQL
- AWS S3 and CloudFront

## Prerequisites

- Node.js 20.9 or newer
- npm
- A Neon or compatible PostgreSQL database
- A Google Gemini API key
- A Google OAuth client ID
- AWS credentials, an S3 bucket, and a CloudFront distribution if you want to use the experimental publishing flow

## Getting started

Install all workspace dependencies from the repository root:

```bash
npm install
```

Create `apps/api/.env`:

```dotenv
PORT=5001
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
GEMINI_API_KEY=your_gemini_api_key

# Required only for publishing
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET=your_bucket_name
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
CLOUDFRONT_DOMAIN=your_distribution_domain
```

Create `apps/web/.env.local`:

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY=your_google_oauth_client_id
```

Push the Drizzle schema to the database:

```bash
npm --workspace apps/api run db:push
```

Start the API and web app in separate terminals:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

The web application runs at [http://localhost:3000](http://localhost:3000), and the API runs at [http://localhost:5001](http://localhost:5001). You can verify the API with `GET /health`.

## Available scripts

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev:web` | Start the Next.js development server |
| `npm run dev:api` | Start the API with automatic TypeScript reloads |
| `npm --workspace apps/web run build` | Create a production web build |
| `npm --workspace apps/web run start` | Serve the production web build |
| `npm --workspace apps/api run db:push` | Push the Drizzle schema to PostgreSQL |
| `npm --workspace apps/api run db:studio` | Open Drizzle Studio |

## API overview

All application routes are mounted below `/api/v1`.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/user` | Create or retrieve a user from Google profile data |
| `GET` | `/user?email=...` | Retrieve a user by email |
| `POST` | `/workspace` | Create a workspace |
| `GET` | `/workspace/:id` | Retrieve one workspace |
| `GET` | `/workspace/:email` | List a user's workspaces |
| `GET` | `/messages/:id` | Retrieve workspace messages |
| `POST` | `/chat` | Generate and save a chat response |
| `POST` | `/gen-code` | Generate code from an arbitrary prompt |
| `POST` | `/generate` | Generate and validate a project file list |
| `GET`, `POST` | `/projects` | List or create in-memory projects |
| `GET`, `POST` | `/files/:projectId` | Read or save in-memory project files |
| `POST` | `/publish` | Build and upload an in-memory project |

## Data model

The current PostgreSQL schema contains two tables:

- `users`: Google profile name, email, picture, and creation time
- `Workspaces`: owner email, serialized messages, serialized generated files, and creation time

Messages and generated files are currently stored as serialized strings rather than native JSON columns.

## Current limitations

- API routes do not yet authenticate or authorize requests.
- CORS currently allows every origin.
- The project and file endpoints use process-local memory and lose their data when the API restarts.
- The database-backed workspace flow and in-memory publishing flow are not yet connected.
- Generated projects are not built in an isolated sandbox. Do not publish untrusted project files in a production environment.
- Generated-file validation and prompt output formats need to be consolidated.
- Automated tests, linting, and continuous integration are not configured yet.

## Security

Keep all `.env` files out of version control. Never expose the server-side Gemini key, database credentials, or AWS credentials through variables prefixed with `NEXT_PUBLIC_`.

The current build-and-publish implementation runs package installation and build commands on generated files. Treat it as development-only until it is isolated with strict resource, filesystem, and network controls.
