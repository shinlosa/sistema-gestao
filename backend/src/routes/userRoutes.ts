import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { authenticate, requireRole } from "../middleware/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userRouter = Router();

userRouter.use(authenticate, requireRole(["admin"]));

userRouter.get("/", userController.list);
userRouter.post("/", asyncHandler(userController.create));
userRouter.put("/:userId", asyncHandler(userController.update));
userRouter.delete("/:userId", userController.delete);

export { userRouter };
