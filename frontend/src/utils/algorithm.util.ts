/**
 * 常用演算法輔助函式。
 * 提供搜尋、洗牌、深度比較、字串相似度等經典演算法。
 */

/**
 * 二元搜尋 (Binary Search)。
 * 在已排序的陣列中，以 O(log n) 的時間複雜度尋找目標值。
 * @param arr 已排序的陣列
 * @param target 尋找的目標
 * @param compareFn 自訂比較函式，預設為基礎的大小比較
 * @returns 找到的索引值，若無則回傳 -1
 */
export function binarySearch<T>(
  arr: T[],
  target: T,
  compareFn: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0),
): number {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = compareFn(arr[mid], target);
    if (comparison === 0) return mid;
    if (comparison < 0) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

/**
 * 陣列洗牌 (Fisher-Yates Shuffle)。
 * 將陣列內的元素隨機打亂，不會改動原陣列。
 * @param arr 原始陣列
 * @returns 隨機打亂後的新陣列
 */

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 深度比較 (Deep Equal)。
 * 比較兩個變數是否在結構與數值上完全相等。
 * @param obj1 比較對象1
 * @param obj2 比較對象2
 * @returns 是否完全相等
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * 計算兩個字串的編輯距離 (Levenshtein Distance)。
 * 常應用於模糊搜尋或拼字檢查。
 * @param s1 字串 1
 * @param s2 字串 2
 * @returns 編輯距離 (0 代表完全一樣)
 */
export function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const matrix = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // 插入
        matrix[j - 1][i] + 1, // 刪除
        matrix[j - 1][i - 1] + indicator, // 替換
      );
    }
  }
  return matrix[s2.length][s1.length];
}
