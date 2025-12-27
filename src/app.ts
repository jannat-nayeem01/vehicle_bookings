import express, { Request, Response } from "express";

import { log } from "node:console";
import { CLIENT_RENEG_LIMIT } from "node:tls";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import vehicleRoutes from "./modules/vehicles/vehicles.routes";
import auth from "./middleware/auth";
import bookingRoutes from "./modules/bookings/booking.routes";

import { autoReturnBookings } from "./jobs/autoReturnBookings.job";

const app = express();

//DB

initDB();
//Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", logger, (req: Request, res: Response) => {
//   res.send("Hello World Kumu!");
// });
const API_BASE_PATH = "/api/v1";

app.use(`${API_BASE_PATH}/auth`, authRoutes);
app.use(`${API_BASE_PATH}/vehicles`, vehicleRoutes);
app.use(`${API_BASE_PATH}/users`, userRoutes);
app.use(`${API_BASE_PATH}/bookings`, bookingRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

autoReturnBookings.start();
export default app;
