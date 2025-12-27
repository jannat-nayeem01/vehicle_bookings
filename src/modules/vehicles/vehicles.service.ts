import { pool } from "../../config/db";
import { autoReturnBookings } from "../../jobs/autoReturnBookings.job";

const addVehicle = async (payload: Record<string, unknown>) => {
  const result = await pool.query(
    `
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
    [
      payload.vehicle_name,
      payload.type,
      payload.registration_number,
      payload.daily_rent_price,
      payload.availability_status,
    ]
  );
  return result;
};

const getAllVehicles = async () => {
  autoReturnBookings.start();

  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

const getVehicleById = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);
  return result.rows[0];
};

const updateVehicle = async (
  vehicleId: string,
  updatedData: Record<string, unknown>
) => {
  const result = await pool.query(
    `
       UPDATE vehicles
       SET vehicle_name = $1,
           type = $2,
           registration_number = $3,
           daily_rent_price = $4,
           availability_status = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
    [
      updatedData.vehicle_name,
      updatedData.type,
      updatedData.registration_number,
      updatedData.daily_rent_price,
      updatedData.availability_status,
      vehicleId,
    ]
  );
  return result.rows[0];
};

const deleteVehicle = async (vehicleId: string) => {
  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 AND availability_status = true`,
    [vehicleId]
  );
  return result;
};

export const vehiclesService = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
