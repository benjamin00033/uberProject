import { getFieldValue, isEmptyValue } from './form.util';

export type Operator = '===' | '!==' | '>' | '>=' | '<' | '<=' | 'contains' | 'in' | 'empty' | 'notEmpty';

export interface ConditionRule {
  /** 表單中的欄位路徑，例如 'user.age' */
  field: string;
  /** 比較運算子 */
  operator: Operator;
  /** 目標值（empty / notEmpty 不需要此值） */
  value?: any;
}

/**
 * 評估動態表單的單一條件規則。
 *
 * 常用於決定某個動態欄位是否顯示 (v-if)、是否必填 (required) 或是否禁用 (disabled)。
 * 例如：如果「付款方式」選擇「信用卡」，才顯示「信用卡號」欄位。
 *
 * @param formData 完整的表單資料
 * @param rule 條件規則物件
 * @example
 * const isVisible = evaluateRule({ user: { age: 20 } }, { field: 'user.age', operator: '>=', value: 18 });
 * // → true
 */
export function evaluateRule(formData: Record<string, any>, rule: ConditionRule): boolean {
  const fieldValue = getFieldValue(formData, rule.field);

  switch (rule.operator) {
    case '===':
      return fieldValue === rule.value;
    case '!==':
      return fieldValue !== rule.value;
    case '>':
      return Number(fieldValue) > Number(rule.value);
    case '>=':
      return Number(fieldValue) >= Number(rule.value);
    case '<':
      return Number(fieldValue) < Number(rule.value);
    case '<=':
      return Number(fieldValue) <= Number(rule.value);
    case 'contains':
      return String(fieldValue).includes(String(rule.value));
    case 'in':
      return Array.isArray(rule.value) && rule.value.includes(fieldValue);
    case 'empty':
      return isEmptyValue(fieldValue);
    case 'notEmpty':
      return !isEmptyValue(fieldValue);
    default:
      return false;
  }
}

/**
 * 評估多個條件規則（支援 AND / OR 邏輯組合）。
 *
 * 在動態表單中，欄位的顯示可能取決於多個前置條件。
 *
 * @param formData 完整的表單資料
 * @param rules 條件規則陣列
 * @param matchType 邏輯類型，'AND' (全部符合) 或 'OR' (符合其一)
 * @example
 * const rules = [
 *   { field: 'role', operator: '===', value: 'admin' },
 *   { field: 'age', operator: '>=', value: 18 }
 * ];
 * const isMatched = evaluateConditions(data, rules, 'AND');
 */
export function evaluateConditions(
  formData: Record<string, any>,
  rules: ConditionRule[],
  matchType: 'AND' | 'OR' = 'AND'
): boolean {
  if (!rules || rules.length === 0) return true;

  if (matchType === 'AND') {
    return rules.every((rule) => evaluateRule(formData, rule));
  } else {
    return rules.some((rule) => evaluateRule(formData, rule));
  }
}
