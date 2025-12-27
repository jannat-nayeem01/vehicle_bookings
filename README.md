ends

🛠️ Technology Stack

Node.js

TypeScript

Express.js – Web framework

PostgreSQL – Relational database

NeonDB – Cloud PostgreSQL service

bcrypt – Password hashing

jsonwebtoken (JWT) – Authentication & authorization

node-cron – Background scheduling

pg – PostgreSQL client

dotenv – Environment variable management

1. Initialize the Project
   npm init -y
2. Install Core Dependencies
   npm install express
   npm install pg
   npm install dotenv
   npm install bcrypt
   npm install jsonwebtoken
   npm install node-cron

3. Install Development Dependencies
   npm install -D typescript
   npm install -D tsx
   npm install -D @types/node
   npm install -D @types/express
   npm install -D @types/pg
   npm install -D @types/bcrypt
   npm install -D @types/jsonwebtoken

4. Initialize TypeScript

5. npx tsc --init

6. Run TypeScript Files
   npx tsx watch ./src/server.ts

7. Project Structure
   src/
   │
   ├── app.ts
   ├── server.ts
   │
   ├── config/
   │ ├── db.ts
   │ └── index.ts
   │
   ├── modules/
   │ ├── auth/
   │ │ ├── auth.routes.ts
   │ │ ├── auth.controller.ts
   │ │ └── auth.service.ts
   │ │
   │ ├── users/
   │ │ ├── user.routes.ts
   │ │ ├── user.controller.ts
   │ │ └── user.service.ts
   │ │
   │ ├── vehicles/
   │ │ ├── vehicle.routes.ts
   │ │ ├── vehicle.controller.ts
   │ │ └── vehicle.service.ts
   │ │
   │ └── bookings/
   │ ├── booking.routes.ts
   │ ├── booking.controller.ts
   │ └── booking.service.ts
   │
   ├── jobs/
   │ └── autoReturnBookings.ts
   │
   ├── middleware/
   │ ├── auth.ts
   │ └── logger.ts
   │
   └── types/
   └── express.d.ts
