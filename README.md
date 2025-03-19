# Fibud Corp Backend Assessment

This project implements backend features for Fibud Corp's expert matching service using NestJS and Prisma. It includes APIs for creating matches between experts and clients and fetching matches with optional filters.

## Table of Contents

- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Design Choices](#design-choices)
  - [Database Schema](#database-schema)
  - [API Endpoints](#api-endpoints)
  - [Error Handling](#error-handling)
  - [Testing (Personal Addition)](#testing)

## Setup Instructions

### Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (Node Package Manager)
- MongoDB (MongoDB Atlas by default)
- Prisma CLI (installed globally via `npm install -g prisma`)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Darkboy17/fibud-backend.git
    cd fibud-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    - Create a `.env` file in the root directory.
    - Add your MongoDB connection string:

    ```env
    DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/fibud_db?retryWrites=true&w=majority"
    ```

### Database Setup

1. Generate the Prisma client:

    ```bash
    npx prisma generate
    ```

2. Push the schema to the database:

    ```bash
    npx prisma db push
    ```

3. (Optional) Seed the database with dummy data:

    ```bash
    npx ts-node seed.ts
    ```

### Running the Application

1. Start the NestJS application:

    ```bash
    npm run start:dev
    ```

2. The API will be available at:

    ```
    http://localhost:3000
    ```

## Design Choices

### Database Schema

The database schema is designed using Prisma and includes the following models:

#### Expert

Represents an expert with fields like name, specialization, availability, and rating.

#### Client

Represents a client with a name field.

#### Match

Represents a match between an expert and a client. Includes foreign keys (`expertId` and `clientId`) to establish relationships.

#### Example Schema:

```prisma
model Expert {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  specialization String
  availability  String
  rating        Float
  matches       Match[]
}

model Client {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  matches       Match[]
}

model Match {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  expertId      String   @db.ObjectId
  clientId      String   @db.ObjectId
  expert        Expert   @relation(fields: [expertId], references: [id])
  client        Client   @relation(fields: [clientId], references: [id])
  createdAt     DateTime @default(now())
}
```

### API Endpoints

#### 1. `POST /matches`

- **Purpose**: Create a new match between an expert and a client.
- **Request Body**:

    ```json
    {
      "expertId": "65f8e1b1e4b0a1a2b3c4d5e6",
      "clientId": "65f8e1b1e4b0a1a2b3c4d5e7"
    }
    ```

- **Response**:

    ```json
    {
      "id": "65f8e1b1e4b0a1a2b3c4d5e8",
      "expertId": "65f8e1b1e4b0a1a2b3c4d5e6",
      "clientId": "65f8e1b1e4b0a1a2b3c4d5e7",
      "createdAt": "2025-03-18T18:14:36.000Z"
    }
    ```

#### 2. `GET /matches`

- **Purpose**: Fetch all matches, optionally filtered by specialization or rating.
- **Query Parameters**:
  - `specialization`: Filter matches by expert specialization.
  - `rating`: Filter matches by expert rating.

- **Example Request**:

    ```
    GET /matches?specialization=Software&rating=4.5
    ```

- **Response**:

    ```json
    [
      {
        "id": "65f8e1b1e4b0a1a2b3c4d5e8",
        "expert": {
          "name": "John Doe",
          "specialization": "Software",
          "availability": "Full-time",
          "rating": 4.5
        },
        "client": {
          "name": "Client A"
        }
      }
    ]
    ```

### Error Handling

- **Validation Errors**:
  - Returns `400 Bad Request` for invalid input.
- **Database Errors**:
  - Returns `500 Internal Server Error` for unexpected database errors.

### Testing (Personal Addition)

- Unit tests are written using Jest to cover all edge cases and ensure the API works as expected.

- To run the tests:

    ```bash
    npm test
    ```
