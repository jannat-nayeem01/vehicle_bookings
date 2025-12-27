import { Router } from "express";
const router = Router();
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";

router.post(
  "/",
  logger,
  auth("admin", "customer"),
  bookingControllers.createBooking
);

router.get(
  "/",
  logger,
  auth("admin", "customer"),
  bookingControllers.getBookings
);

router.put("/:bookingId", logger, auth(), bookingControllers.updateBookings);

const bookingRoutes = router;

export default bookingRoutes;
