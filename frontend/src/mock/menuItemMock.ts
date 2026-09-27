import { http, HttpResponse } from "msw";
import type { Item } from "../domain/menu/types";
import { createStandardResponse } from "./handlers";

const API_KEYS = {
  MENU_ITEMS_GET: "MENU_ITEMS_GET",
  MENU_ITEMS_GET_ONE: "MENU_ITEMS_GET_ONE",
  MENU_ITEMS_POST: "MENU_ITEMS_POST",
  MENU_ITEMS_PUT: "MENU_ITEMS_PUT",
  MENU_ITEMS_DELETE: "MENU_ITEMS_DELETE",
} as const;

// In-memory mock DB for menu items
export let mockMenuItems: Item[] = [
  {
    id: "item_1",
    title: { translations: { en: "Black Tea", zh: "紅茶" } },
    description: { translations: { en: "Classic Black Tea", zh: "經典紅茶" } },
    image_url: "",
    price_info: { price: 30 },
    quantity_info: { quantity: { max_permitted: 10 } },
    modifier_group_ids: { ids: ["sugars", "ices"] },
    tax_info: {},
    nutritional_info: { allergens: null },
    dish_info: { classifications: {} },
  },
  {
    id: "item_2",
    title: { translations: { en: "Green Tea", zh: "綠茶" } },
    description: { translations: { en: "Fresh Green Tea", zh: "清香綠茶" } },
    image_url: "",
    price_info: { price: 30 },
    quantity_info: { quantity: { max_permitted: 10 } },
    modifier_group_ids: { ids: ["sugars", "ices"] },
    tax_info: {},
    nutritional_info: { allergens: null },
    dish_info: { classifications: {} },
  },
];

export const menuItemCallbacks: Record<string, any> = {
  [API_KEYS.MENU_ITEMS_GET]: (config: any) => {
    return http.get("/api/menu-items", () => {
      return HttpResponse.json(createStandardResponse(mockMenuItems));
    });
  },
  [API_KEYS.MENU_ITEMS_GET_ONE]: (config: any) => {
    return http.get("/api/menu-items/:id", ({ params }) => {
      const item = mockMenuItems.find((i) => i.id === params.id);
      if (!item)
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "404",
            message: "Not found",
          }),
          { status: 404 },
        );
      return HttpResponse.json(createStandardResponse(item));
    });
  },
  [API_KEYS.MENU_ITEMS_POST]: (config: any) => {
    return http.post("/api/menu-items", async ({ request }) => {
      const data = (await request.json()) as Item;
      if (mockMenuItems.some((i) => i.id === data.id)) {
        return HttpResponse.json(
          createStandardResponse(null, {
            success: false,
            res_code: "400",
            message: "ID exists",
          }),
          { status: 400 },
        );
      }
      mockMenuItems.push(data);
      return HttpResponse.json(createStandardResponse(data));
    });
  },
  [API_KEYS.MENU_ITEMS_PUT]: (config: any) => {
    return http.put("/api/menu-items/:id", async ({ request, params }) => {
      const data = (await request.json()) as Item;
      const index = mockMenuItems.findIndex((i) => i.id === params.id);
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
      mockMenuItems[index] = { ...mockMenuItems[index], ...data };
      return HttpResponse.json(createStandardResponse(mockMenuItems[index]));
    });
  },
  [API_KEYS.MENU_ITEMS_DELETE]: (config: any) => {
    return http.delete("/api/menu-items/:id", ({ params }) => {
      mockMenuItems = mockMenuItems.filter((i) => i.id !== params.id);
      return HttpResponse.json(createStandardResponse(null));
    });
  },
};
