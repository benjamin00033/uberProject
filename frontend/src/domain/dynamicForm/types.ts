// 定義支援多語系的字串型別
export type I18nString = string | Record<string, string>;

// 1. 升級驗證規則：改為陣列結構，支援單一欄位有多重驗證條件（例如：必填 + 格式 + 長度）
export interface ValidationRule {
  type: "required" | "pattern" | "min" | "max" | "custom";
  rule?: string | number | RegExp; // 規則內容 (例如正則表達式或最小長度)
  errorMessage: I18nString; // 驗證失敗時的提示訊息
  validatorName?: string; // 用於自訂複合驗證器的名稱 (對應全域註冊的驗證函式)
}

// 2. 核心：可擴充的欄位定義 (FormField)
export interface FormField {
  id: string; // 欄位唯一識別碼 (對應 formData 的 key 值，如 'user_email')
  label: I18nString; // 欄位顯示名稱 (支援多國語言物件)
  // 【修改點】取消寫死的字串聯集，改為 string，允許自訂元件（如 'address-picker'）自由註冊
  type: string;
  // 【新增點】給自訂組件的專屬擴充參數。
  // 每個自訂元件需要的 Props 不同，透過這個密袋物件（Record）封裝，直接用 v-bind 丟給元件
  props?: Record<string, any>;

  // 【新增點】預設值設定。v-model 初始化時非常需要（例如：文字預設 '', 複選預設 []）
  defaultValue?: any;

  // 【修改點】改為陣列，支援多重驗證
  validations?: ValidationRule[];

  // 【進階擴充】條件式顯示邏輯 (可選)
  // 讓表單欄位可以根據「其他 key 值」的內容決定要不要顯示
  dependsOn?: {
    fieldId: string; // 依賴的欄位 key
    operator: "equals" | "contains" | "notEquals";
    value: any; // 當該欄位符合此值時，本欄位才顯示
  };

  // 【前端排版控管】(可選)
  placeholder?: I18nString;
  colSpan?: number; // RWD 柵格排版，例如 12 欄制中佔用 6 欄

  // 【新增點】支援巢狀樹狀結構 (Tree Structure)
  // 當 type 為 'group', 'object', 'card', 'row' 等排版或容器元件時使用
  children?: FormField[];

  // 【新增點】動態擴充格式 (Array/List Structure)
  // 當 type 為 'array', 'list' 等可動態新增多筆資料的元件時，定義單筆資料的 Schema
  itemSchema?: FormField | FormField[];
}

// 4. 完整的動態多步驟表單計畫表 (DynamicFormSchema)
export interface DynamicFormSchema {
  formId: string;
  title: I18nString;
  totalSteps: number;
  steps: FormStep[];
}

// 定義條件判斷
export interface StepCondition {
  fieldId: string; // 依賴判斷的欄位 ID (例如 'user_role')
  operator: "eq" | "neq" | "gt" | "lt" | "contains"; // 判斷邏輯
  value: any; // 判斷值 (例如 'vip_member')
  targetStepId: string; // 符合條件時，跳轉至此步驟
}

export interface FormStep {
  stepId: string;
  stepTitle: I18nString;
  fields: FormField[];
  // 【新增路由設定】
  routing?: {
    defaultNextStepId: string | null; // 預設的下一步 (若為 null 代表這是最後一步)
    conditionalSteps?: StepCondition[]; // 條件路由 (優先級高於預設值)
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  res_code: string;
  ts: string;
  res_body: T;
}
