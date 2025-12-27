import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.login);

const authRoutes = router;
export default authRoutes;
