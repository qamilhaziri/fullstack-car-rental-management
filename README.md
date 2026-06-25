# Car Rental Management

A full-stack web application for managing a car rental business: vehicle inventory, customers, rentals, payments, maintenance records, damages, pricing, and administrator access.

This project was built to model the daily workflow of a rental company where staff need one place to see available vehicles, register clients, start rentals, track returns, and keep operational records connected to each vehicle.

## Demo
- https://fullstack-car-rental-management.onrender.com

## Business Problem

Car rental teams often manage vehicle availability, customer details, maintenance, payments, and damage reports across disconnected spreadsheets or manual records. That makes it easy to double-book vehicles, lose rental history, miss maintenance context, or make decisions with outdated information.

This application solves that problem by centralizing the main operational data in a single protected dashboard. Staff can quickly check which cars are available, register rental activity, and keep vehicle-related records organized around the same database.

## Key Features

- Secure administrator login with JWT authentication stored in HTTP-only cookies
- Protected dashboard for authenticated users
- Available vehicle overview with pagination and rental actions
- Vehicle management with brand, cost, specification, and image upload support
- Client registration and client record management
- Rental registration by vehicle and client
- Rental lookup by vehicle or client
- Payment tracking connected to rentals
- Vehicle maintenance tracking
- Vehicle damage tracking
- Vehicle cost management for hourly and daily rental pricing
- Request validation using Zod schemas
- API rate limiting for login and general requests
- Structured HTTP logging with Pino
- Docker configuration for local full-stack deployment

## Technical Architecture

The project is organized as a classic full-stack application with a React frontend, Express backend, and PostgreSQL database.

```text
car_rental_management/
├── backend/                       # Express REST API
│   ├── controllers/                # Request handlers
│   ├── models/                     # Knex database access
│   ├── routes/                     # API route definitions
│   ├── validators/                 # Zod request schemas
│   ├── middleware/                 # Auth, validation, logging, rate limits, uploads
│   ├── services/                   # Auth service layer
│   ├── config/                     # Database and JWT config
│   └── app.js                      # Express app entry point
├── frontend/car-rental-management/ # React + Vite frontend
│   ├── src/api/                    # Axios API clients
│   ├── src/components/             # Layout and reusable UI components
│   ├── src/context/                # Auth, client, and vehicle state
│   ├── src/pages/                  # Dashboard, vehicles, clients, rentals, login
│   └── src/routes/                 # Protected routing
├── docker-compose.yml              # PostgreSQL, backend, and frontend services
└── DOCKER.md                       # Docker notes
```

### Backend

The backend exposes a REST API using Express. Routes are grouped by business domain, then passed through controllers and model methods. Knex handles PostgreSQL queries, while create operations call stored procedures such as `register_vehicle`, `register_client`, `register_rent`, and `register_payment`.

Authentication is handled with bcrypt password checks and signed JWT access tokens. Protected API routes use middleware that verifies the token from the `access_token` cookie before allowing access.

### Frontend

The frontend is a React single-page application built with Vite. It uses React Router for page navigation, protected routes for authenticated screens, Axios for API communication, and Tailwind CSS for styling.

Main pages include:

- Login
- Dashboard
- Clients
- Vehicles
- Rents

### Database

PostgreSQL stores the core rental business data, including administrators, vehicles, brands, clients, rents, payments, vehicle costs, maintenance records, and damage records.

## Technologies

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- PostgreSQL
- Knex.js
- JWT
- bcrypt
- Zod
- Multer
- Helmet
- express-rate-limit
- Pino / pino-http

### DevOps

- Docker
- Docker Compose
- Nginx for serving the frontend container

## API Overview

All protected routes require a valid login session.

| Area | Base Route | Purpose |
| --- | --- | --- |
| Auth | `/api/auth` | Login, logout, current user |
| Brands | `/api/brands` | Vehicle brand records |
| Vehicles | `/api/vehicles` | Vehicle inventory and available vehicles |
| Clients | `/api/clients` | Customer records |
| Rentals | `/api/rent` | Rental registration and rental history |
| Payments | `/api/payment` | Payments connected to rentals |
| Vehicle Costs | `/api/vehicleCost` | Hourly and daily pricing |
| Maintenance | `/api/vehicleMaintenances` | Vehicle service records |
| Damages | `/api/vehicleDamages` | Vehicle damage records |

## Running Locally

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Docker, optional

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a backend `.env` file with values like:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carRentalManagement
JWT_SECRET=your-local-secret
JWT_EXPIRES_IN=45min
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info
```

The backend runs on:

```text
http://localhost:5005
```

### Frontend

```bash
cd frontend/car-rental-management
npm install
npm run dev
```

Optional frontend `.env`:

```env
VITE_API_URL=http://localhost:5005/api
```

The frontend runs on:

```text
http://localhost:5173
```

### Docker

The repository includes Docker files for the database, backend, and frontend.

```bash
docker compose up --build
```

With the current compose port mapping, the frontend is exposed at:

```text
http://localhost:5173
```

The backend API is exposed at:

```text
http://localhost:5005/api
```

## Challenges Solved

- Designed a relational structure that connects clients, vehicles, rentals, payments, maintenance, damage, and pricing.
- Separated backend responsibilities into routes, controllers, models, middleware, validators, and services.
- Added authentication and route protection so only logged-in administrators can access business data.
- Used Zod schemas to validate incoming API payloads before they reach database logic.
- Implemented file upload handling for vehicle images with Multer.
- Built reusable frontend API modules so pages communicate with the backend consistently.
- Added rate limiting, Helmet, cookie-based auth, and structured logging to make the API more production-minded.
- Containerized the frontend and backend for easier local deployment and review.

## What I Learned

- How to build a full-stack CRUD application around a real business workflow.
- How to structure an Express API by domain instead of keeping all logic in one file.
- How to protect API routes using JWT authentication and middleware.
- How frontend state, protected routing, and API calls work together in a React application.
- How to use PostgreSQL and Knex for relational data access.
- How validation improves reliability before data reaches the database.
- How small backend details like logging, rate limiting, CORS, and cookies affect real application behavior.

## Project Status

It demonstrates practical full-stack development, database-backed business logic, authentication, API design, frontend routing, reusable components, and deployment awareness.

