import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { authenticate, requireRole } from "../middleware/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userRouter = Router();

userRouter.use(authenticate, requireRole(["admin"]));

userRouter.get("/", asyncHandler(userController.list));
userRouter.post("/", asyncHandler(userController.create));
userRouter.put("/:userId", asyncHandler(userController.update));
userRouter.delete("/:userId", asyncHandler(userController.delete));
userRouter.patch("/:userId/role", asyncHandler(userController.changeRole));
userRouter.post("/:userId/approve", asyncHandler(userController.approve));
userRouter.post("/:userId/reject", asyncHandler(userController.reject));
userRouter.post("/:userId/suspend", asyncHandler(userController.suspend));
userRouter.post("/:userId/reactivate", userController.reactivate);

export { userRouter };
