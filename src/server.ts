import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
import { log } from "node:console";
import { CLIENT_RENEG_LIMIT } from "node:tls";
// const express = require("express");
const app = express();
const port = 3000;
//DB
const pool = new Pool({
  connectionString: "${process.env.CONNECTION_STR}",
});
const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR (150) NOT NULL UNIQUE,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(10) NOT NULL CHECK (role IN('admin','customer')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
  );
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL check (type IN('car','bike','van' ,'SUV')),
        registration_number VARCHAR(20) NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10,2) NOT NULL,
        availability_status VARCHAR(20) check (availability_status IN ('available', 'booked')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date TIMESTAMP NOT NULL,
        rent_end_date TIMESTAMP NOT NULL,
        total_price NUMERIC(10,2) NOT NULL CHECK(total_price > 0),
        status VARCHAR(20) CHECK(status IN('active','cancelled','returned')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CHECK (rent_end_date > rent_start_date)
        );
         `);
};

initDB();
//Parser
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World Kumu!");
});

app.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({
    success: true,
    message: "Post Request Received",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
