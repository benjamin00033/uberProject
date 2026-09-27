import { http, HttpResponse } from "msw";
import type { Budget } from "../domain/budget/types";
import { createStandardResponse } from "./handlers";

const API_KEYS = {
  BUDGET_GET: "BUDGET_GET",
  BUDGET_GET_ONE: "BUDGET_GET_ONE",
  BUDGET_POST: "BUDGET_POST",
  BUDGET_PUT: "BUDGET_PUT",
  BUDGET_DELETE: "BUDGET_DELETE",
} as const;

export let mockBudgets: Budget[] = [
  {
    id: "budget_1",
    title: "Marketing Campaign",
    amount: 5000,
    category: "Marketing",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    isActive: true,
  },
  {
    id: "budget_2",
    title: "Office Supplies",
    amount: 1500,
    category: "Operations",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isActive: true,
  },
];

export const budgetCallbacks: Record<string, any> = {
  [API_KEYS.BUDGET_GET]: (config: any) => {
    return http.get("/api/budgets", () => {
      return HttpResponse.json(createStandardResponse(mockBudgets));
    });
  },
  [API_KEYS.BUDGET_GET_ONE]: (config: any) => {
    return http.get("/api/budgets/:id", ({ params }) => {
      const item = mockBudgets.find((i) => i.id === params.id);
      if (!item) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "404",
            message: "Not found",
          }),
          { status: 404 },
        );
      }
      return HttpResponse.json(createStandardResponse(item));
    });
  },
  [API_KEYS.BUDGET_POST]: (config: any) => {
    return http.post("/api/budgets", async ({ request }) => {
      const data = (await request.json()) as Budget;
      if (mockBudgets.some((i) => i.id === data.id)) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "400",
            message: "ID exists",
          }),
          { status: 400 },
        );
      }
      mockBudgets.push(data);
      return HttpResponse.json(createStandardResponse(data));
    });
  },
  [API_KEYS.BUDGET_PUT]: (config: any) => {
    return http.put("/api/budgets/:id", async ({ request, params }) => {
      const data = (await request.json()) as Budget;
      const index = mockBudgets.findIndex((i) => i.id === params.id);
      if (index === -1) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "404",
            message: "Not found",
          }),
          { status: 404 },
        );
      }
      mockBudgets[index] = { ...mockBudgets[index], ...data };
      return HttpResponse.json(createStandardResponse(mockBudgets[index]));
    });
  },
  [API_KEYS.BUDGET_DELETE]: (config: any) => {
    return http.delete("/api/budgets/:id", ({ params }) => {
      mockBudgets = mockBudgets.filter((i) => i.id !== params.id);
      return HttpResponse.json(createStandardResponse(null));
    });
  },
};
