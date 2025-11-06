import { Request, Response } from "express";
import { activityLogService } from "../services/activityLogService.js";

export const activityLogController = {
  list: (request: Request, response: Response) => {
    const page = Math.max(1, Number(request.query.page ?? 1));
    const perPage = Math.max(1, Math.min(100, Number(request.query.perPage ?? 20)));

    // Filtros opcionais
    const userId = request.query.userId as string | undefined;
    const action = request.query.action as string | undefined;
    const from = request.query.from as string | undefined;
    const to = request.query.to as string | undefined;

    let all = activityLogService.list();

    // Aplicar filtros
    if (userId) {
      all = all.filter((log) => log.userId === userId);
    }
    if (action) {
      all = all.filter((log) => log.action.toLowerCase().includes(action.toLowerCase()));
    }
    if (from) {
      const fromDate = new Date(from);
      all = all.filter((log) => new Date(log.timestamp) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      all = all.filter((log) => new Date(log.timestamp) <= toDate);
    }

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const offset = (page - 1) * perPage;
    const logs = all.slice(offset, offset + perPage);

    return response.json({ logs, meta: { total, page, perPage, totalPages } });
  },
};
