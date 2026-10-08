# Bolt 2.0

Bolt 2.0 is an AI-powered React application builder. Describe an interface, let Gemini generate the project files, and inspect the result in an interactive code editor and live preview.

## Features

- Generate React applications from natural-language prompts with Google Gemini
- Sign in with Google OAuth
- Browse generated files and edit code in a Sandpack workspace
- Preview generated applications directly in the browser
- Continue a conversation with the AI inside each workspace
- Persist users, workspaces, messages, and generated files in Postgres
- Build and publish generated projects to Amazon S3 behind CloudFront

## Tech stack

- **Web:** Next.js 16, React 19, Tailwind CSS 4, Sandpack
- **API:** Express 5, TypeScript, Gemini API
- **Database:** Neon Postgres with Drizzle ORM
- **Publishing:** Amazon S3 and CloudFront
- **Repository:** npm workspaces

## Repository structure

```text
.
├── apps/
│   ├── api/       # Express API, AI generation, persistence, and publishing
│   └── web/       # Next.js user interface and Sandpack workspace
├── packages/
│   ├── config/    # Shared server configuration
│   └── shared/    # Shared TypeScript types
├── package.json
└── tsconfig.base.json
```

## Getting started

### Prerequisites

- Node.js 20.9 or newer
- npm
- A Postgres database (the application uses the Neon serverless driver)
- A Google Gemini API key
- A Google OAuth web client ID

AWS credentials are only required if you use the publishing endpoint.

### 1. Install dependencies

From the repository root:

```bash
npm install
```

### 2. Configure the API

Create `apps/api/.env`:

```dotenv
PORT=5001
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
GEMINI_API_KEY=your_gemini_api_key
```

To enable publishing generated projects, add:

```dotenv
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET=your_bucket_name
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
CLOUDFRONT_DOMAIN=your_distribution_domain
```

### 3. Configure the web app

Create `apps/web/.env`:

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY=your_google_oauth_client_id
```

Add `http://localhost:3000` to the authorized JavaScript origins for your Google OAuth client.

### 4. Create the database tables

Push the Drizzle schema to the configured database:

```bash
npm --workspace apps/api run db:push
```

### 5. Start the development servers

Run the API and web app in separate terminals from the repository root:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000). The API runs on [http://localhost:5001](http://localhost:5001), and its health check is available at `GET /health`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev:web` | Start the Next.js development server |
| `npm run dev:api` | Start the Express API with automatic reloads |
| `npm --workspace apps/web run build` | Create a production web build |
| `npm --workspace apps/web run start` | Serve the production web build |
| `npm --workspace apps/api run db:push` | Push the Drizzle schema to Postgres |
| `npm --workspace apps/api run db:studio` | Open Drizzle Studio |

## How it works

1. A user signs in with Google and submits an application idea.
2. The web app sends the prompt to the Express API.
3. Gemini returns a set of generated React files.
4. The API stores the workspace and generated files in Postgres.
5. Sandpack renders the files as an editable code workspace and live preview.
6. Optionally, the API can build a generated project, upload it to S3, and serve it through CloudFront.

## API overview

All application routes use the `/api/v1` prefix.

| Route | Purpose |
| --- | --- |
| `/user` | Create or retrieve a user |
| `/workspace` | Create and retrieve saved workspaces |
| `/messages` | Retrieve a workspace conversation |
| `/chat` | Generate and save a follow-up AI response |
| `/gen-code` | Generate application code from a prompt |
| `/projects` and `/files` | Manage in-memory project data used by the publishing flow |
| `/publish` | Build and publish a generated project to S3 and CloudFront |

## Notes

- Never commit `.env` files or credentials. The repository already ignores the API and web environment files.
- The `/projects`, `/files`, and `/publish` flow currently stores project files in memory, so that data is lost when the API restarts.
- Building AI-generated code executes `npm install` and `npm run build`. Use an isolated environment before exposing the publishing endpoint to untrusted users.
