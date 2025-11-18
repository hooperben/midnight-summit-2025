# LegitSick API

Backend API server for the LegitSick application. Provides endpoints to interact with the Midnight Network contract.

## Prerequisites

- [Bun](https://bun.com) runtime installed
- The contracts must be deployed (deployment.json must exist in ../contracts/)

## Installation

```bash
bun install
```

## Running

Development mode (with hot reload):
```bash
bun run dev
```

Production mode:
```bash
bun run start
```

The server will start on http://localhost:3001 by default. You can configure the port using the PORT environment variable.

## API Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### GET /api/is-doctor/:address
Check if a Midnight shielded address is registered as a doctor in the contract.

**Parameters:**
- `address` - A Midnight shielded address (e.g., `mn_shield-addr_test1...`)

**Response:**
```json
{
  "address": "mn_shield-addr_test1...",
  "isDoctor": true
}
```

**Error Response:**
```json
{
  "error": "Failed to check doctor status",
  "message": "Error details..."
}
```

## Architecture

This API server:
1. Loads the deployed contract configuration from `../contracts/deployment.json`
2. Queries the Midnight Network testnet indexer for contract state
3. Uses the compiled contract module to decode the state and check doctor status
4. Provides a browser-friendly REST API for the client application

This architecture solves the issue of Midnight SDK libraries not working in the browser by running them server-side with Node.js-compatible APIs.
