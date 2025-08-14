export interface DecodeResult {
  bitmap: ImageBitmap
  meta: {
    width: number
    height: number
    orientation?: number
  }
}

export async function decodeImage(arrayBuffer: ArrayBuffer): Promise<DecodeResult> {
  try {
    // 优先使用 createImageBitmap，性能更好
    const blob = new Blob([arrayBuffer])
    const bitmap = await createImageBitmap(blob)
    
    return {
      bitmap,
      meta: {
        width: bitmap.width,
        height: bitmap.height
      }
    }
  } catch (error) {
    // 如果 createImageBitmap 失败，尝试其他方法
    console.warn('createImageBitmap failed, trying fallback:', error)
    throw new Error(`无法解码图像: ${error}`)
  }
}

// 检查图像格式支持
export function isFormatSupported(format: string): boolean {
  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']
  return supportedFormats.includes(format)
}

// 获取图像信息
export function getImageInfo(arrayBuffer: ArrayBuffer): Promise<{ width: number; height: number; type: string }> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuffer])
    const url = URL.createObjectURL(blob)
    const img = new Image()
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: blob.type
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('无法读取图像信息'))
    }
    
    img.src = url
  })
}
