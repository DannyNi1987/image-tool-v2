import { FormatOptions } from '../types'

export interface EncodeResult {
  blob: Blob
  outputMeta?: any
}

// 延迟加载 @squoosh/lib
let squooshLib: any = null

async function loadSquooshLib() {
  if (!squooshLib) {
    try {
      squooshLib = await import('@squoosh/lib')
    } catch (error) {
      console.error('Failed to load @squoosh/lib:', error)
      throw new Error('图像编码库加载失败')
    }
  }
  return squooshLib
}

export async function encodeImage(bitmap: ImageBitmap, options: FormatOptions): Promise<EncodeResult> {
  const lib = await loadSquooshLib()
  
  // 将 ImageBitmap 转换为 ImageData
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  // 创建编码器
  const encoder = new lib.Image(imageData.data, imageData.width, imageData.height)
  
  try {
    switch (options.format) {
      case 'jpeg':
        await encoder.encode({
          mozjpeg: {
            quality: options.quality || 80,
            progressive: options.progressive || false
          }
        })
        break
        
      case 'png':
        await encoder.encode({
          oxipng: {
            level: 2 // 中等压缩级别
          }
        })
        break
        
      case 'webp':
        await encoder.encode({
          libwebp: {
            quality: options.quality || 80
          }
        })
        break
        
      case 'avif':
        await encoder.encode({
          libavif: {
            cqLevel: Math.max(0, Math.min(63, 63 - Math.floor((options.quality || 80) * 0.63)))
          }
        })
        break
        
      default:
        throw new Error(`不支持的输出格式: ${options.format}`)
    }
    
    // 获取编码结果
    const { data, size } = await encoder.encodedWith[options.format]
    
    // 创建 Blob
    const blob = new Blob([data], { type: getMimeType(options.format) })
    
    return {
      blob,
      outputMeta: {
        size,
        format: options.format,
        width: bitmap.width,
        height: bitmap.height
      }
    }
  } finally {
    // 清理资源
    encoder.free()
  }
}

function getMimeType(format: string): string {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    case 'gif':
      return 'image/gif'
    default:
      return 'image/jpeg'
  }
}

// 简单的 Canvas 编码（作为降级方案）
export async function encodeWithCanvas(
  bitmap: ImageBitmap, 
  options: FormatOptions
): Promise<EncodeResult> {
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0)
  
  // 使用 convertToBlob 方法（OffscreenCanvas 的替代方案）
  try {
    const blob = await canvas.convertToBlob({
      type: getMimeType(options.format),
      quality: options.format === 'jpeg' ? (options.quality || 80) / 100 : undefined
    })
    
    return {
      blob,
      outputMeta: {
        format: options.format,
        width: bitmap.width,
        height: bitmap.height
      }
    }
  } catch (error) {
    throw new Error('Canvas 编码失败')
  }
}
