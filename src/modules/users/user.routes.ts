import { Router } from "express";
const router = Router();

import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

router.put("/:userId", auth("Admin", "Customer"), userControllers.updateUser);

router.get("/", auth("admin"), userControllers.getAllUsers);

router.delete("/:userId", auth("admin"), userControllers.deleteUser);

const userRoutes = router;

export default userRoutes;
