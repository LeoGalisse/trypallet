# TryPallet

A shipment management API built with Express and TypeScript.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.28.2 or higher)

## Installation

```bash
pnpm install
```

## Running the Application

### Development Mode

```bash
pnpm start:dev
```

Server will start on `http://localhost:3333`

### Production Mode

Build the application:

```bash
pnpm build
```

Start the server:

```bash
pnpm start
```

## Available Routes

### Create Shipment

**POST** `/shipments`

Request body:
```json
{
  "from": "string",
  "to": "string",
  "status": "pending" | "in_progress" | "delivered"
}
```

### Get Shipment by ID

**GET** `/shipments/:id`

### Update Shipment Status

**PUT** `/shipments/:id/status`

Request body:
```json
{
  "status": "pending" | "in_progress" | "delivered"
}
```

## Testing

### Run all tests

```bash
pnpm test
```

### Run tests in watch mode

```bash
pnpm test:watch
```

### Run tests with coverage

```bash
pnpm test:coverage
```

### Run tests with UI

```bash
pnpm test:ui
```
