export let mockMenus: any[] = [
  {
    id: "store_hours",
    title: { translations: { en: "Store Hours", zh: "營業時間" } },
    category_ids: [],
    service_availability: [
      {
        day_of_week: "MONDAY",
        time_periods: [{ start_time: "09:00", end_time: "21:00" }],
      },
      {
        day_of_week: "TUESDAY",
        time_periods: [{ start_time: "09:00", end_time: "21:00" }],
      },
      {
        day_of_week: "WEDNESDAY",
        time_periods: [{ start_time: "09:00", end_time: "21:00" }],
      },
      {
        day_of_week: "THURSDAY",
        time_periods: [{ start_time: "09:00", end_time: "21:00" }],
      },
      {
        day_of_week: "FRIDAY",
        time_periods: [{ start_time: "09:00", end_time: "21:00" }],
      },
      {
        day_of_week: "SATURDAY",
        time_periods: [{ start_time: "09:00", end_time: "21:00" }],
      },
      {
        day_of_week: "SUNDAY",
        time_periods: [{ start_time: "09:00", end_time: "21:00" }],
      },
    ],
  },
];

import { http, HttpResponse } from "msw";
import { createStandardResponse } from "./handlers";

const API_KEYS = {
  MENUS_GET: "MENUS_GET",
  MENUS_GET_ONE: "MENUS_GET_ONE",
  MENUS_POST: "MENUS_POST",
  MENUS_PUT: "MENUS_PUT",
  MENUS_DELETE: "MENUS_DELETE",
} as const;

export const menuCallbacks: Record<string, any> = {
  [API_KEYS.MENUS_GET]: (config: any) => {
    return http.get("/api/menus", () => {
      return HttpResponse.json(createStandardResponse(mockMenus));
    });
  },
  [API_KEYS.MENUS_GET_ONE]: (config: any) => {
    return http.get("/api/menus/:id", ({ params }) => {
      const item = mockMenus.find((i) => i.id === params.id);
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
  [API_KEYS.MENUS_PUT]: (config: any) => {
    return http.put("/api/menus/:id", async ({ request, params }) => {
      const data = (await request.json()) as any;
      const index = mockMenus.findIndex((i) => i.id === params.id);
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
      mockMenus[index] = { ...mockMenus[index], ...data };
      return HttpResponse.json(createStandardResponse(mockMenus[index]));
    });
  },
};
