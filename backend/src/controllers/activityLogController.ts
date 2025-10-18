import { Request, Response } from "express";
import { activityLogService } from "../services/activityLogService.js";

export const activityLogController = {
  list: (_request: Request, response: Response) => {
    const logs = activityLogService.list();
    return response.json({ logs });
  },
};
