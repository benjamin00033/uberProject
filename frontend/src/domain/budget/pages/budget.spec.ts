// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BudgetPage from "./budget.vue";

vi.mock("vue-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/vue-query", () => ({
  useQuery: () => ({ data: { value: [] }, isLoading: { value: false } }),
  useMutation: () => ({ mutate: vi.fn() }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

vi.mock("../services/budgetApi", () => ({
  budgetApi: {
    getBudgets: vi.fn(),
    deleteBudget: vi.fn(),
  },
}));

describe("BudgetPage", () => {
  it("renders correctly", () => {
    const wrapper = mount(BudgetPage, {
      global: {
        stubs: ["ion-page", "ion-header", "ion-toolbar", "ion-title", "ion-content", "ion-button", "ion-icon", "ion-fab", "ion-fab-button"],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
