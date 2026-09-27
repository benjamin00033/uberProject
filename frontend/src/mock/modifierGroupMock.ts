import { http, HttpResponse } from "msw";
import type { ModifierGroup } from "../domain/menu/types";
import { createStandardResponse } from "./handlers";

// 1. 定義 Map Key
const API_KEYS = {
  MODIFIER_GROUPS_GET: "MODIFIER_GROUPS_GET",
  MODIFIER_GROUPS_GET_ONE: "MODIFIER_GROUPS_GET_ONE",
  MODIFIER_GROUPS_POST: "MODIFIER_GROUPS_POST",
  MODIFIER_GROUPS_PUT: "MODIFIER_GROUPS_PUT",
  MODIFIER_GROUPS_DELETE: "MODIFIER_GROUPS_DELETE",
} as const;

// In-memory mock DB for modifier groups
export let mockModifierGroups: ModifierGroup[] = [
  {
    id: "sugars",
    title: { translations: { en: "Sugars", zh: "甜度" } },
    modifier_options: [
      { id: "normal_sugar", type: "ITEM" },
      { id: "less_sugar", type: "ITEM" },
    ],
  },
  {
    id: "ices",
    title: { translations: { en: "Ices", zh: "冰塊" } },
    modifier_options: [
      { id: "normal_ice", type: "ITEM" },
      { id: "less_ice", type: "ITEM" },
    ],
  },
];

export const modifierGroupCallbacks: Record<string, any> = {
  [API_KEYS.MODIFIER_GROUPS_GET]: (config: any) => {
    return http.get("/api/modifier-groups", () => {
      return HttpResponse.json(createStandardResponse(mockModifierGroups));
    });
  },
  [API_KEYS.MODIFIER_GROUPS_GET_ONE]: (config: any) => {
    return http.get("/api/modifier-groups/:id", ({ params }) => {
      const group = mockModifierGroups.find((g) => g.id === params.id);
      if (!group)
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "404",
            message: "Not found",
          }),
          { status: 404 },
        );
      return HttpResponse.json(createStandardResponse(group));
    });
  },
  [API_KEYS.MODIFIER_GROUPS_POST]: (config: any) => {
    return http.post("/api/modifier-groups", async ({ request }) => {
      const data = (await request.json()) as ModifierGroup;
      if (mockModifierGroups.some((g) => g.id === data.id)) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "400",
            message: "ID exists",
          }),
          { status: 400 },
        );
      }
      mockModifierGroups.push(data);
      return HttpResponse.json(createStandardResponse(data));
    });
  },
  [API_KEYS.MODIFIER_GROUPS_PUT]: (config: any) => {
    return http.put("/api/modifier-groups/:id", async ({ request, params }) => {
      const data = (await request.json()) as ModifierGroup;
      const index = mockModifierGroups.findIndex((g) => g.id === params.id);
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
      mockModifierGroups[index] = { ...mockModifierGroups[index], ...data };
      return HttpResponse.json(
        createStandardResponse(mockModifierGroups[index]),
      );
    });
  },
  [API_KEYS.MODIFIER_GROUPS_DELETE]: (config: any) => {
    return http.delete("/api/modifier-groups/:id", ({ params }) => {
      mockModifierGroups = mockModifierGroups.filter((g) => g.id !== params.id);
      return HttpResponse.json(createStandardResponse(null));
    });
  },
};
