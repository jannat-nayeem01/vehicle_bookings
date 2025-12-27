import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  const loggedInUser = req.user;
  //   console.log("loggedInUser", loggedInUser);
  if (!loggedInUser) {
    return res.status(401).json({ message: "Unauthorized!" });
  } else {
    try {
      const result = await bookingServices.createBooking(
        loggedInUser.id,
        req.body
      );
      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
};

const getBookings = async (req: Request, res: Response) => {
  const loggedInUser = req.user;
  if (!loggedInUser) {
    return res.status(401).json({ message: "Unauthorized!" });
  } else {
    try {
      const result = await bookingServices.getBookings(loggedInUser);
      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
};

const updateBookings = async (req: Request, res: Response) => {
  const loggedInUser = req.user;
  if (!loggedInUser) {
    return res.status(401).json({ message: "Unauthorized!" });
  } else {
    try {
      //   console.log("req.body", req.body);
      const bookingId = req.params.bookingId;
      //   console.log("bookingId", bookingId);
      if (!bookingId) {
        return res.status(400).json({ message: "Booking not found." });
      }

      const updatedBookingInfo = req.body;
      if (!updatedBookingInfo) {
        return res.status(400).json({ message: "No data provided." });
      }
      const result = await bookingServices.updateBookings(
        bookingId as string,
        loggedInUser,
        req.body
      );
      res.status(200).json({
        success: true,
        // data: result.rows[0],
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBookings,
};
