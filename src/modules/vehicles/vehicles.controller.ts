import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service.js";

const addVehicle = async (req: Request, res: Response) => {
  console.log("Hello from Add Vehicle Controller");
  console.log(req.body);
  try {
    const result = await vehiclesService.addVehicle(req.body);
    console.log("\nVehicle added:", result);
    res
      .status(201)
      .json({ message: "Vehicle added successfully", vehicle: result });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getAllVehicles();
    console.log("\nAll vehicles:", result);
    res.status(200).json({ vehicles: result });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId;
  try {
    const result = await vehiclesService.getVehicleById(vehicleId as string);
    if (result) {
      console.log("\nVehicle found:", result);
      res.status(200).json({ vehicle: result });
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId;
  const updateData = req.body;
  try {
    // Assuming vehiclesService.updateVehicle is implemented
    const result = await vehiclesService.updateVehicle(
      vehicleId as string,
      updateData
    );
    if (result) {
      console.log("\nVehicle updated:", result);
      res
        .status(200)
        .json({ message: "Vehicle updated successfully", vehicle: result });
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const vehicleId = req.params.vehicleId;
  try {
    // Assuming vehiclesService.deleteVehicle is implemented
    const result = await vehiclesService.deleteVehicle(vehicleId as string);
    if (result) {
      console.log("\nVehicle deleted:", result);
      res.status(200).json({ message: "Vehicle deleted successfully" });
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const vehiclesController = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
export default vehiclesController;
