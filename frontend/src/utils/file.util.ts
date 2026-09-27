/**
 * 觸發瀏覽器下載 Blob (二進位檔案資料)。
 *
 * 常用於 ERP 匯出 Excel、PDF 或 CSV 的下載。
 *
 * @param blob 二進位檔案資料
 * @param filename 下載時預設的檔案名稱
 * @example
 * const blob = new Blob(['data'], { type: 'text/csv' });
 * downloadBlob(blob, 'export.csv');
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // 清理記憶體
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

/**
 * 將檔案大小的 Bytes 轉換為人類易讀的格式 (KB, MB, GB)。
 *
 * @param bytes 檔案大小 (位元組)
 * @param decimals 保留的小數位數 (預設 2)
 * @example
 * const size = formatFileSize(1048576);
 * // → '1.00 MB'
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
