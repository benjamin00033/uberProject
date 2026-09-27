/**
 * 將物件參數轉換為 URL Query String。
 *
 * 自動過濾掉值為 null、undefined 或空字串的屬性。
 *
 * @param params 查詢參數物件
 * @example
 * const query = buildQueryString({ page: 1, search: '', type: 'user' });
 * // → 'page=1&type=user'
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {});

  return new URLSearchParams(filteredParams).toString();
}

/**
 * 將 URL 上的 Query String 解析回物件。
 *
 * @param queryString URL 的查詢字串（可包含開頭的 ?）
 * @example
 * const obj = parseQueryString('?page=1&type=user');
 * // → { page: '1', type: 'user' }
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

/**
 * 安全地拼接 URL 路徑，避免雙斜線問題。
 *
 * @param paths 要拼接的路徑片段陣列
 * @example
 * const url = joinPaths(['https://api.example.com/', '/users/', '/123']);
 * // → 'https://api.example.com/users/123'
 */
export function joinPaths(paths: string[]): string {
  return paths
    .map((part, index) => {
      if (index === 0) {
        return part.replace(/\/+$/, '');
      }
      if (index === paths.length - 1) {
        return part.replace(/^\/+/, '');
      }
      return part.replace(/^\/+|\/+$/g, '');
    })
    .filter(Boolean)
    .join('/');
}
