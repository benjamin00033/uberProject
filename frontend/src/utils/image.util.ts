/**
 * 圖片處理與壓縮輔助函式。
 */

export interface CompressImageOptions {
  /** 最大寬度 (預設 1920) */
  maxWidth?: number;
  /** 最大高度 (預設 1080) */
  maxHeight?: number;
  /** 圖片品質 0 ~ 1 (預設 0.8) */
  quality?: number;
  /** 輸出格式，如 'image/jpeg', 'image/webp' (預設 'image/jpeg') */
  mimeType?: string;
}

/**
 * 壓縮圖片 (透過 Canvas 進行縮放與品質降低)。
 * 
 * 常用於前端上傳圖片前，先在本地端縮小檔案體積以節省頻寬與伺服器空間。
 *
 * @param file 原始圖片檔案 (File 或 Blob)
 * @param options 壓縮選項 (最大寬高、品質、格式)
 * @returns 壓縮後的 Blob
 * @example
 * const compressedBlob = await compressImage(file, { maxWidth: 800, quality: 0.7 });
 * // 可以將 Blob 再轉為 File: new File([compressedBlob], file.name, { type: 'image/jpeg' })
 */
export async function compressImage(
  file: File | Blob,
  options: CompressImageOptions = {}
): Promise<Blob> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, mimeType = 'image/jpeg' } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 計算等比例縮放
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas context is not available in this environment.'));
        }

        // 繪製縮放後的圖片
        ctx.drawImage(img, 0, 0, width, height);

        // 輸出為 Blob
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob conversion failed.'));
          },
          mimeType,
          quality
        );
      };
      
      img.onerror = (error) => reject(error);
    };
    
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 將 File 或 Blob 轉換為 Base64 字串 (DataURL)。
 *
 * 常用於圖片的本地預覽 (img src="base64...")。
 *
 * @param file 要轉換的檔案
 * @example
 * const base64 = await fileToBase64(file);
 * // → 'data:image/png;base64,iVBORw0KGgo...'
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
