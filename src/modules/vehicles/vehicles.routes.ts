// Add new vehicle with name, type, registration, daily rent price and availability status
import auth from "../../middleware/auth.js";
import logger from "../../middleware/logger.js";
import vehiclesController from "./vehicles.controller.js";

import Router from "express";
const router = Router();

router.post("/", logger, auth("admin"), vehiclesController.addVehicle);
router.get("/", logger, vehiclesController.getAllVehicles);
router.get("/:vehicleId", logger, vehiclesController.getVehicleById);
//Update vehicle details, daily rent price or availability status
router.put(
  "/:vehicleId",
  logger,
  auth("admin"),
  vehiclesController.updateVehicle
);
//Delete vehicle (only if no active bookings exist)
router.delete(
  "/:vehicleId",
  logger,
  auth("admin"),
  vehiclesController.deleteVehicle
);
const vehicleRoutes = router;
export default vehicleRoutes;
