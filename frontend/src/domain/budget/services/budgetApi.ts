import type { Budget } from "../types";

const BASE_URL = "/api/budgets";

export const budgetApi = {
  getBudgets: async (): Promise<Budget[]> => {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.res_body;
  },

  createBudget: async (payload: Budget): Promise<Budget> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.res_body;
  },

  updateBudget: async (id: string, payload: Budget): Promise<Budget> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.res_body;
  },

  deleteBudget: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
  },
};
