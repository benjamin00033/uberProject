/**
 * 將一維扁平陣列轉換為樹狀結構（常用於組織圖、BOM表、多層級選單）。
 *
 * @param items 扁平的一維陣列
 * @param idKey 唯一識別碼的欄位名稱 (預設 'id')
 * @param parentIdKey 指向父層的欄位名稱 (預設 'parentId')
 * @param childrenKey 生成的子節點屬性名稱 (預設 'children')
 * @example
 * const flat = [
 *   { id: 1, parentId: null, name: 'CEO' },
 *   { id: 2, parentId: 1, name: 'CTO' }
 * ];
 * const tree = buildTree(flat);
 * // → [{ id: 1, parentId: null, name: 'CEO', children: [{ id: 2, parentId: 1, name: 'CTO', children: [] }] }]
 */
export function buildTree<T extends Record<string, any>>(
  items: T[],
  idKey: string = 'id',
  parentIdKey: string = 'parentId',
  childrenKey: string = 'children'
): T[] {
  const rootItems: T[] = [];
  const lookup: Record<string, T> = {};

  // 建立 lookup table 並初始化 children 陣列
  for (const item of items) {
    lookup[item[idKey]] = { ...item, [childrenKey]: [] };
  }

  // 組合為樹狀結構
  for (const item of items) {
    const parentId = item[parentIdKey];
    if (parentId !== null && parentId !== undefined && lookup[parentId]) {
      lookup[parentId][childrenKey].push(lookup[item[idKey]]);
    } else {
      rootItems.push(lookup[item[idKey]]);
    }
  }

  return rootItems;
}

/**
 * 將樹狀結構拍平為一維陣列（常配合打 API 儲存前處理使用）。
 *
 * @param tree 樹狀陣列
 * @param childrenKey 子節點屬性名稱 (預設 'children')
 * @example
 * const flat = flattenTree([{ id: 1, children: [{ id: 2, children: [] }] }]);
 * // → [{ id: 1 }, { id: 2 }]
 */
export function flattenTree<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children'
): Omit<T, typeof childrenKey>[] {
  const result: any[] = [];

  function recurse(nodes: T[]) {
    for (const node of nodes) {
      const { [childrenKey]: children, ...rest } = node;
      result.push(rest);
      if (Array.isArray(children) && children.length > 0) {
        recurse(children as T[]);
      }
    }
  }

  recurse(tree);
  return result;
}
