import { error } from "node:console";
import { pool } from "../../config/db";
import { vehiclesService } from "../vehicles/vehicles.service";

// Customer or Admin
// Create booking with start/end dates
// • Validates vehicle availability
// • Calculates total price (daily rate × duration)
// • Updates vehicle status to "booked"

const createBooking = async (
  userId: string,
  bookingData: Record<string, any>
) => {
  if (!userId) {
    throw new Error("Invalid Customer");
  } else {
    const vehicleId = bookingData.vehicle_id;
    const vehicleInfo = await vehiclesService.getVehicleById(vehicleId);
    // console.log("vehicleInfo", vehicleInfo);
    if (vehicleInfo.length === 0) {
      throw new Error("Vehicle not found.");
    }
    if (vehicleInfo.availability_status !== "available") {
      throw new Error("Vehicle is not available for booking.");
    }
    const startDate = new Date(bookingData.rent_start_date);
    const endDate = new Date(bookingData.rent_end_date);
    const durationInDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    if (durationInDays <= 0) {
      throw new Error("End date must be after start date.");
    }
    const totalPrice = Number(vehicleInfo.daily_rent_price) * durationInDays;
    if (totalPrice <= 0) {
      throw new Error("Total price must be greater than zero.");
    }
    bookingData.total_price = totalPrice;
    bookingData.status = "active";
    const result = await pool.query(
      ` INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [
        userId,
        vehicleId,
        bookingData.rent_start_date,
        bookingData.rent_end_date,
        bookingData.total_price,
        bookingData.status,
      ]
    );

    const updateVehicleStatus = await pool.query(
      `UPDATE vehicles
SET availability_status = 'booked', updated_at = NOW()
WHERE id = $1 AND availability_status = 'available'
RETURNING *
`,
      [vehicleId]
    );
    if (updateVehicleStatus.rowCount === 0) {
      throw new Error("Failed to update vehicle status");
    }
    return result;
  }
};

// Role-based	Admin: View all bookings
// Customer: View own bookings only

const getBookings = async (loggedInUser: Record<string, any>) => {
  if (loggedInUser.role === "admin") {
    const result = await pool.query(`SELECT * FROM bookings;`);
    return result;
  } else if (loggedInUser.role === "customer") {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id = $1;`,
      [loggedInUser.id]
    );
    return result;
  } else {
    throw new Error("Unauthorized access");
  }
};

// Customer: Cancel booking (before start date only)
// Admin: Mark as "returned" (updates vehicle to "available")
// System: Auto-mark as "returned" when period ends

const updateBookings = async (
  bookingId: string,
  loggedInUser: Record<string, any>,
  updateData: Record<string, any>
) => {
  // For simplicity, assuming only status update is allowed

  const existingBookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1;`,
    [bookingId]
  );
  if (existingBookingResult.rowCount === 0) {
    throw new Error("Booking not found.");
  }
  const existingBooking = existingBookingResult.rows[0];
  if (updateData.rent_start_date || updateData.rent_end_date) {
    throw new Error("Cannot update rental dates.");
  }

  if (loggedInUser.role === "customer") {
    const currentDate = new Date();
    const rentStartDate = new Date(existingBooking.rent_start_date);
    if (currentDate >= rentStartDate) {
      throw new Error("Cannot cancel booking after rental period has started.");
    } else {
      const cancelBooking = await pool.query(
        `UPDATE bookings
           SET status = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *;`,
        [existingBooking.status, bookingId]
      );
      // Update vehicle status to available
      const updateVehicleStatus = await pool.query(
        `UPDATE vehicles
           SET availability_status = 'available', updated_at = NOW()
           WHERE id = $1
           RETURNING *;`,
        [existingBooking.vehicle_id]
      );
      if (updateVehicleStatus.rowCount === 0) {
        throw new Error("Failed to update vehicle status");
      }
    }
  } else if (loggedInUser.role === "admin") {
    if (
      updateData.status === "returned" &&
      existingBooking.status !== "returned"
    ) {
      const result = await pool.query(
        `UPDATE bookings
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *;`,
        [updateData.status, bookingId]
      );
      const updateVehicleStatus = await pool.query(
        `UPDATE vehicles
       SET availability_status = 'available', updated_at = NOW()
       WHERE id = $1
       RETURNING *;`,
        [existingBooking.vehicle_id]
      );
    }
  } else {
    return error("Unauthorized access");
  }
};
export const bookingServices = {
  createBooking,
  getBookings,
  updateBookings,
};
