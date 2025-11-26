import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { userController } from "../controllers/userController.js";
import { authenticate, requireRole } from "../middleware/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authRouter = Router();

authRouter.post("/login", asyncHandler(authController.login));
authRouter.post("/logout", authenticate, asyncHandler(authController.logout));
authRouter.get("/users", authenticate, requireRole(["admin"]), asyncHandler(userController.list));

export { authRouter };
