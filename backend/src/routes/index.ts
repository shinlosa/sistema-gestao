import { Request, Response, Router } from "express";
import { authRouter } from "./authRoutes.js";
import { namiRouter } from "./namiRoutes.js";
import { userRouter } from "./userRoutes.js";

const appRouter = Router();

appRouter.get("/health", (_request: Request, response: Response) => {
  return response.json({ status: "ok" });
});

appRouter.use("/auth", authRouter);
appRouter.use("/nami", namiRouter);
appRouter.use("/users", userRouter);

export { appRouter };
