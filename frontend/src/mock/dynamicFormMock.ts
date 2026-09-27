import { http, HttpResponse, HttpHandler } from "msw";
import { createStandardResponse } from "./handlers";
import type { DynamicFormSchema } from "../domain/dynamicForm/types";
import type { MockConfig } from "./handlers";

// The hardcoded schema data extracted from dynamicForm.vue
const mockSchema: DynamicFormSchema = {
  formId: "registration",
  title: { zh: "註冊表單", en: "Registration Form" },
  totalSteps: 2,
  steps: [
    {
      stepId: "step-1",
      stepTitle: { zh: "步驟 1：使用者資訊", en: "Step 1: User Information" },
      fields: [
        {
          id: "username",
          label: { en: "Username", zh: "使用者名稱" },
          type: "text",
          placeholder: { en: "Enter your username", zh: "輸入您的使用者名稱" },
          defaultValue: "",
          props: { clearInput: true },
        },
        {
          id: "role",
          label: { en: "Role", zh: "角色" },
          type: "select",
          defaultValue: "user",
          props: {
            options: [
              { label: { en: "Admin", zh: "管理員" }, value: "admin" },
              { label: { en: "User", zh: "一般用戶" }, value: "user" },
            ],
          },
        },
      ],
    },
    {
      stepId: "step-2",
      stepTitle: { zh: "步驟 2：偏好與詳細資料", en: "Step 2: Preferences & Details" },
      fields: [
        {
          id: "agreeTerms",
          label: { en: "I agree to the terms", zh: "我同意使用者條款" },
          type: "checkbox",
          defaultValue: false,
        },
        {
          id: "gender",
          label: { en: "Gender", zh: "性別" },
          type: "radio",
          defaultValue: "male",
          props: {
            options: [
              { label: { en: "Male", zh: "男性" }, value: "male" },
              { label: { en: "Female", zh: "女性" }, value: "female" },
              { label: { en: "Other", zh: "其他" }, value: "other" },
            ],
          },
        },
        {
          id: "birthday",
          label: { en: "Date of Birth", zh: "出生年月日" },
          type: "datepicker",
          defaultValue: "2000-01-01",
          props: { presentation: "date" },
        },
        {
          id: "skills",
          label: { en: "Skills", zh: "技能" },
          type: "multi-select",
          defaultValue: ["vue", "ionic"],
          props: {
            options: [
              { label: { en: "Vue.js", zh: "Vue.js" }, value: "vue" },
              { label: { en: "React", zh: "React" }, value: "react" },
              { label: { en: "Ionic", zh: "Ionic" }, value: "ionic" },
              {
                label: { en: "TailwindCSS", zh: "TailwindCSS" },
                value: "tailwind",
              },
            ],
          },
        },
        {
          id: "bio",
          label: { en: "Biography", zh: "個人簡介" },
          type: "richtext",
          placeholder: {
            en: "Tell us about yourself...",
            zh: "告訴我們關於你的事...",
          },
          defaultValue: "",
        },
      ],
    },
  ],
};

export let mockDynamicForms: DynamicFormSchema[] = [mockSchema];

export const dynamicFormCallbacks: Record<
  string,
  (config: MockConfig) => HttpHandler
> = {
  FORM_SCHEMA_GET: (config) => {
    return http.get("/api/form/schema", () => {
      // 保留原有 endpoint 以免破壞現有邏輯
      return HttpResponse.json(createStandardResponse(mockSchema));
    });
  },
  DYNAMIC_FORMS_GET: (config) => {
    return http.get("/api/dynamic-forms", () => {
      return HttpResponse.json(createStandardResponse(mockDynamicForms));
    });
  },
  DYNAMIC_FORMS_GET_ONE: (config) => {
    return http.get("/api/dynamic-forms/:id", ({ params }) => {
      const item = mockDynamicForms.find((i) => i.formId === params.id);
      if (!item) {
        return HttpResponse.json(
          createStandardResponse(null, { success: false, res_code: "404", message: "Not found" }),
          { status: 404 }
        );
      }
      return HttpResponse.json(createStandardResponse(item));
    });
  },
  DYNAMIC_FORMS_POST: (config) => {
    return http.post("/api/dynamic-forms", async ({ request }) => {
      const data = (await request.json()) as DynamicFormSchema;
      mockDynamicForms.push(data);
      return HttpResponse.json(createStandardResponse(data));
    });
  },
  DYNAMIC_FORMS_PUT: (config) => {
    return http.put("/api/dynamic-forms/:id", async ({ request, params }) => {
      const data = (await request.json()) as DynamicFormSchema;
      const index = mockDynamicForms.findIndex((i) => i.formId === params.id);
      if (index === -1) {
        return HttpResponse.json(
          createStandardResponse(null, { success: false, res_code: "404", message: "Not found" }),
          { status: 404 }
        );
      }
      mockDynamicForms[index] = { ...mockDynamicForms[index], ...data };
      return HttpResponse.json(createStandardResponse(mockDynamicForms[index]));
    });
  },
  DYNAMIC_FORMS_DELETE: (config) => {
    return http.delete("/api/dynamic-forms/:id", ({ params }) => {
      mockDynamicForms = mockDynamicForms.filter((i) => i.formId !== params.id);
      return HttpResponse.json(createStandardResponse({}));
    });
  }
};
