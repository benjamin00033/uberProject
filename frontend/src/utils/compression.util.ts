/**
 * 檔案與資料壓縮輔助函式。
 * 
 * 利用現代瀏覽器原生的 CompressionStream API (支援 gzip 與 deflate)，
 * 提供高效率、無第三方套件依賴的壓縮功能。
 */

/**
 * 將 ArrayBuffer 轉換為 Base64 字串
 * @private
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * 將 Base64 字串轉換為 ArrayBuffer
 * @private
 */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * 壓縮字串資料 (例如龐大的 JSON 字串)。
 * 
 * 常用於：需要將大量資料存入 LocalStorage，或是透過 URL/網路傳輸時減少體積。
 *
 * @param data 要壓縮的字串
 * @param format 壓縮演算法 (預設 'gzip')
 * @returns 壓縮後的 Base64 字串
 * @example
 * const hugeJson = JSON.stringify(hugeObject);
 * const compressedBase64 = await compressString(hugeJson);
 */
export async function compressString(
  data: string,
  format: 'gzip' | 'deflate' = 'gzip'
): Promise<string> {
  const stream = new Response(data).body?.pipeThrough(new CompressionStream(format));
  if (!stream) {
    throw new Error('您的瀏覽器不支援 CompressionStream API');
  }
  const compressedBuffer = await new Response(stream).arrayBuffer();
  return bufferToBase64(compressedBuffer);
}

/**
 * 解壓縮字串資料。
 * 
 * 將被 `compressString` 處理過的 Base64 字串還原為原始字串。
 *
 * @param base64Compressed 壓縮過的 Base64 字串
 * @param format 壓縮演算法 (預設 'gzip')
 * @returns 原始字串
 * @example
 * const originalJson = await decompressString(compressedBase64);
 * const obj = JSON.parse(originalJson);
 */
export async function decompressString(
  base64Compressed: string,
  format: 'gzip' | 'deflate' = 'gzip'
): Promise<string> {
  const buffer = base64ToBuffer(base64Compressed);
  const stream = new Response(buffer).body?.pipeThrough(new DecompressionStream(format));
  if (!stream) {
    throw new Error('您的瀏覽器不支援 DecompressionStream API');
  }
  return await new Response(stream).text();
}

/**
 * 壓縮單一檔案 (File / Blob) 成 GZIP 格式的 Blob。
 * 
 * 常用於：上傳大型日誌檔 (Log)、純文字檔前，先在前端進行壓縮。
 * 注意：若是多檔打包成 `.zip` 檔，需要依賴如 `jszip` 這樣的第三方套件，原生 API 僅支援單一流壓縮。
 *
 * @param file 原始檔案或 Blob
 * @param format 壓縮演算法 (預設 'gzip')
 * @returns 壓縮後的 Blob
 * @example
 * const compressedFileBlob = await compressFile(textFile);
 * // 可轉換回 File：new File([compressedFileBlob], 'data.txt.gz', { type: 'application/gzip' })
 */
export async function compressFile(
  file: Blob,
  format: 'gzip' | 'deflate' = 'gzip'
): Promise<Blob> {
  const stream = file.stream().pipeThrough(new CompressionStream(format));
  return await new Response(stream).blob();
}
