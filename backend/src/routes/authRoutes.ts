import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { authenticate, requireRole } from "../middleware/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authRouter = Router();

authRouter.post("/login", asyncHandler(authController.login));
authRouter.get("/users", authenticate, requireRole(["admin"]), authController.listUsers);

export { authRouter };
