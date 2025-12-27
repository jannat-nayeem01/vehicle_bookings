import cron from "node-cron";
import { pool } from "../config/db";

// every minute
export const autoReturnBookings = cron.schedule("* * * * *", async () => {
  try {
    const expiredBookings = await pool.query(
      `
        SELECT id, vehicle_id
        FROM bookings
        WHERE status = 'active'
          AND rent_end_date <= NOW();
        `
    );

    if (expiredBookings.rowCount === 0) {
      return;
    }
    for (const booking of expiredBookings.rows) {
      await pool.query(
        `
          UPDATE bookings
          SET status = 'returned', updated_at = NOW()
          WHERE id = $1;
          `,
        [booking.id]
      );

      await pool.query(
        `
          UPDATE vehicles
          SET availability_status = 'available', updated_at = NOW()
          WHERE id = $1;
          `,
        [booking.vehicle_id]
      );
    }

    //   console.log(`Auto-returned ${expiredBookings.rowCount} booking(s).`);
  } catch (err) {
    console.error("Auto-return bookings job failed:", err);
  }
});
