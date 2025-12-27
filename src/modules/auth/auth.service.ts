import { hash } from "node:crypto";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "./../../config";

const signup = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
            INSERT INTO users (name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  return result;
};

const login = async (email: string, password: string) => {
  const result = await pool.query(
    `
          SELECT * FROM users WHERE email=$1`,
    [email]
  );
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return false;
  }
  const secret = config.secret;
  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role, id: user.id },
    secret as string,
    {
      expiresIn: "7d",
    }
  );
  console.log("Generated Token:", token);
  return { token, user };
};

const authServices = {
  signup,
  login,
};

export { authServices };
