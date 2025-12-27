import { Request, Response } from "express";

import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const targetUserId = Number(req.params.userId);

  const requester = req.user;
  console.log("Requester:", requester);
  console.log("Target User ID:", targetUserId);
  if (!requester) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    if (requester.id === targetUserId || requester.role === "admin") {
      const result = await userServices.updateUser(
        requester,
        targetUserId,
        req.body
      );

      return res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(Number(req.params.userId));
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userControllers = {
  updateUser,
  getAllUsers,
  deleteUser,
};
