# Raver.ai Backend

This is the Express.js backend for the Raver.ai platform, providing a robust REST API for managing users, campaigns, projects, assets, templates, and AI agents.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- An AWS RDS PostgreSQL instance (or local PostgreSQL) for full database functionality.

### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Configure your environment variables. Ensure you have a `.env` file in the root directory and add your PostgreSQL database URL and a JWT Secret. For example:
   ```env
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[RDS_ENDPOINT]:[PORT]/[DATABASE_NAME]?schema=public"
   JWT_SECRET="your_super_secret_jwt_key_here"
   ```

### Running the Application

To start the server in development mode with live-reloading enabled:

```bash
npm run dev
```

The API will start and listen for requests on `http://localhost:8000` (or whatever port is defined in your environment).

## 📁 Project Structure

The project follows a modular, domain-driven architecture:

- `src/app.ts`: Express application initialization, CORS, and middleware setup.
- `src/server.ts`: Bare HTTP server entry point.
- `src/db/`: Prisma client instantiation.
- `src/modules/`: Contains business logic, separated by domain models:
  - `agent/` - AI Agent execution and provisioning
  - `asset/` - Media metadata and S3 uploads
  - `billing/` - Stripe integrations and subscriptions
  - `campaign/` - Ad campaign wizard configurations
  - `project/` - High-level organizational containers
  - `template/` - Reusable node-based ad templates
  - `user/` - User profiles and settings

## 🔌 API Endpoints Documentation

All endpoints respond with a standard standardized JSON wrapper:
```json
{
  "success": true,
  "data": { ... } // or "message": "..." on errors/deletes
}
```

> **Security Note**: All endpoints beneath `/api/*` (except `/api/auth/*` and `http://localhost:8000/health`) are **protected via JWT Authentication**. You must pass a valid token via the request headers: `Authorization: Bearer <token>`.

### 1. Authentication Module (`/api/auth`)
| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `POST` | `http://localhost:8000/api/auth/signup` | `{ email, password, fullName? }` | `{ user, token }` | Registers a new user and returns JWT |
| `POST` | `http://localhost:8000/api/auth/login` | `{ email, password }` | `{ user, token }` | Authenticates user and returns JWT |

### 2. User Module (`/api/users`)
| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `GET` | `http://localhost:8000/api/users` | - | `Array<User>` | Fetches all users |
| `POST` | `http://localhost:8000/api/users` | `{ email, fullName?, avatarUrl? }` | `User` | Creates a new user |
| `GET` | `http://localhost:8000/api/users/me` | - | `User` | Fetches active authenticated user |
| `PUT` | `http://localhost:8000/api/users/settings` | `{ theme, notifications... }` | `{ updated: true }` | Updates active user settings |
| `GET` | `http://localhost:8000/api/users/:id` | `params: { id }` | `User` | Fetches a specific user |
| `PUT` | `http://localhost:8000/api/users/:id` | `{ ...userFieldsToUpdate }` | `User` | Updates a specific user |
| `DELETE`| `http://localhost:8000/api/users/:id` | `params: { id }` | `{ deleted: true }` | Deletes a user |

### 3. Campaign Module (`/api/campaigns`)
| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `GET` | `http://localhost:8000/api/campaigns` | - | `Array<Campaign>` | Fetches all campaigns |
| `POST` | `http://localhost:8000/api/campaigns` | `{ name, platform, budget, config }` | `Campaign` | Creates a new ad campaign |
| `GET` | `http://localhost:8000/api/campaigns/:id` | `params: { id }` | `Campaign` | Fetches a specific campaign |
| `PUT` | `http://localhost:8000/api/campaigns/:id` | `{ ...campaignFieldsToUpdate }` | `Campaign` | Updates a campaign |
| `DELETE`| `http://localhost:8000/api/campaigns/:id`| `params: { id }` | `{ deleted: true }` | Deletes a campaign |

### 4. Project Module (`/api/projects`)
| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `GET` | `http://localhost:8000/api/projects` | - | `Array<Project>` | Fetches all projects |
| `POST` | `http://localhost:8000/api/projects` | `{ name, description? }` | `Project` | Creates a new project |
| `GET` | `http://localhost:8000/api/projects/:id` | `params: { id }` | `Project` | Fetches a specific project |
| `PUT` | `http://localhost:8000/api/projects/:id` | `{ ...projectFieldsToUpdate }` | `Project` | Updates a project |
| `DELETE`| `http://localhost:8000/api/projects/:id` | `params: { id }` | `{ deleted: true }` | Deletes a project |

### 5. Asset Module (`/api/assets`)
| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `GET` | `http://localhost:8000/api/assets` | - | `Array<Asset>` | Fetches all creative assets |
| `POST` | `http://localhost:8000/api/assets/upload`| `{ filename, contentType }` | `{ uploadUrl, assetId }` | Returns a pre-signed S3 upload URL |
| `GET` | `http://localhost:8000/api/assets/:id` | `params: { id }` | `Asset` | Fetches asset metadata |
| `DELETE`| `http://localhost:8000/api/assets/:id` | `params: { id }` | `{ deleted: true }` | Deletes an asset |

### 6. Template Module (`/api/templates`)
| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `GET` | `http://localhost:8000/api/templates` | - | `Array<Template>` | Fetches all templates |
| `POST` | `http://localhost:8000/api/templates` | `{ name, category, isPublic, data }` | `Template` | Creates a new template |
| `GET` | `http://localhost:8000/api/templates/:id`| `params: { id }` | `Template` | Fetches a specific template |
| `PUT` | `http://localhost:8000/api/templates/:id`| `{ ...templateFieldsToUpdate }` | `Template` | Updates a template |
| `DELETE`| `http://localhost:8000/api/templates/:id`| `params: { id }` | `{ deleted: true }` | Deletes a template |

### 7. Agent Module (`/api/agents`)
| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `GET` | `http://localhost:8000/api/agents` | - | `Array<Agent>` | Fetches all AI agents |
| `POST` | `http://localhost:8000/api/agents` | `{ name, type, status }` | `Agent` | Provisions a new AI agent |
| `GET` | `http://localhost:8000/api/agents/:id` | `params: { id }` | `Agent` | Fetches a specific agent |
| `PUT` | `http://localhost:8000/api/agents/:id` | `{ ...agentFieldsToUpdate }` | `Agent` | Updates agent configuration |
| `DELETE`| `http://localhost:8000/api/agents/:id` | `params: { id }` | `{ deleted: true }` | Deletes an agent |
| `POST` | `http://localhost:8000/api/agents/:id/execute`| `{ taskData }` | `Agent` | Updates agent status to "processing" to handle task |

### 8. Core & Billing
| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `GET` | `http://localhost:8000/health` | - | `String: "OK"` | Healthcheck |
| `GET` | `http://localhost:8000/api/billing/subscription` | - | `SubscriptionData` | Fetches active subscription plan |
| `POST` | `http://localhost:8000/api/billing/payment-methods` | `{ stripeToken }` | `{ status: "success" }` | Attaches payment method |
