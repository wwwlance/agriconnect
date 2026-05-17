**Agriconnect Backend System**

A backend system built with NestJS + Nx monorepo architecture demonstrating:

Transaction-safe request handling

Redis-based event distribution

Concurrency control using database locking

Modular service architecture

Unit testing with Jest

🚀 Tech Stack

NestJS

Nx Monorepo

PostgreSQL (TypeORM)

Redis (Pub/Sub)

Jest (Unit Testing)

Node.js


🧩 Architecture Overview

The system is composed of multiple services:

Farmers Service – manages farmer data

Products Service – handles product catalog and seeding

Requests Service – handles distributor-to-farmer requests

Redis Layer – publishes request events for real-time processing


⚡ Key Features

1. Concurrency-Safe Requests

Uses PostgreSQL pessimistic locking to prevent race conditions when multiple distributors send requests simultaneously.

2. Event-Driven Communication

After a request is created, an event is published via Redis Pub/Sub:

request.created → Redis → Notification layer

3. Transactional Integrity

All request operations are wrapped in database transactions to ensure atomicity.

🧪 Testing Strategy

Unit Tests

Service logic isolation

Repository mocking

Pagination and seed logic validation

Concurrency Simulation

Parallel request execution using Promise.all

Validates locking and transaction safety


🐳 Running the Project

npm install

Start database (Docker)

docker compose up -d

Run API

npx nx serve api

Run tests

npx nx test api

📡 Example Flow

Distributor sends request

API locks relevant farmer rows

Transaction creates request entries

Redis publishes event

Notification service consumes event (future extension)


🔒 Concurrency Handling

The system uses:

pessimistic locking using SELECT FOR UPDATE

Transactions via TypeORM DataSource

Atomic bulk inserts to ensure no duplicate or inconsistent requests under parallel load.
