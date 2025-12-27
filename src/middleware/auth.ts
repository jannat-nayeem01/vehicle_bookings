import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    try {
      const decoded = jwt.verify(token, config.secret as string) as JwtPayload;
      // console.log("Decoded Token:", decoded);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
  };
};
export default auth;
