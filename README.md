## Overview

This repository contains a **backend REST API** for a **Vehicle Rental Management System**, built with **Node.js, TypeScript, Express, and PostgreSQL**.

The system follows a **modular, feature-based architecture** with clear separation of concerns and supports **secure role-based access control** for **Admin** and **Customer** users.

## Technology Stack

- **Node.js**
- **TypeScript**
- **Express.js** – Web framework
- **PostgreSQL** – Relational database
- **NeonDB** – Cloud PostgreSQL service
- **bcrypt** – Password hashing
- **jsonwebtoken (JWT)** – Authentication & authorization
- **node-cron** – Background scheduling
- **pg** – PostgreSQL client
- **dotenv** – Environment variable management

## Initialize the Project

npm init -y

## Install Core Dependencies

### Install Core Dependencies

```bash
npm install express
npm install pg
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
npm install node-cron
```

### Install Development Dependencies

```bash
npm install -D typescript
npm install -D tsx
npm install -D @types/node
npm install -D @types/express
npm install -D @types/pg
npm install -D @types/bcrypt
npm install -D @types/jsonwebtoken
```

### Initialize TypeScript

```bash
npx tsc --init
```

### Run the Application

```bash
npx tsx watch ./src/server.ts
```

---

## Project Structure

```text
src/
│
├── app.ts
├── server.ts
│
├── config/
│   ├── db.ts
│   └── index.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   │
│   ├── users/
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   └── user.service.ts
│   │
│   ├── vehicles/
│   │   ├── vehicle.routes.ts
│   │   ├── vehicle.controller.ts
│   │   └── vehicle.service.ts
│   │
│   └── bookings/
│       ├── booking.routes.ts
│       ├── booking.controller.ts
│       └── booking.service.ts
│
├── jobs/
│   └── autoReturnBookings.ts
│
├── middleware/
│   ├── auth.ts
│   └── logger.ts
│
└── types/
    └── express.d.ts
```

---

## 🔑 Authentication & Authorization

- Uses **JWT (JSON Web Tokens)**
- Two user roles:
  - **Admin**
  - **Customer**
