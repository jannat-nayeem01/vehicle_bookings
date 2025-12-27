import { Request, Response } from "express";

import { authServices } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  console.log("Hello from Signup Controller");
  console.log(req.body);
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await authServices.signup(
      name,
      email,
      password,
      phone,
      role
    );
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message + "\n Signup Failed....",
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authServices.login(email, password);
    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message + "\n Login Failed....",
    });
  }
};

export const authController = {
  signup,
  login,
};
