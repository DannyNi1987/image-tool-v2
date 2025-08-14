import { SizeOptions } from '../types'

export async function applyResize(bitmap: ImageBitmap, options: SizeOptions): Promise<ImageBitmap> {
  if (!options.enabled) return bitmap

  // 计算目标尺寸
  const { targetWidth, targetHeight } = calculateTargetSize(bitmap.width, bitmap.height, options)
  
  // 如果尺寸没有变化，直接返回
  if (targetWidth === bitmap.width && targetHeight === bitmap.height) {
    return bitmap
  }

  // 创建目标 canvas
  const canvas = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')!
  
  // 设置图像平滑
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  
  // 绘制缩放后的图像
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
  
  // 清理原 bitmap
  bitmap.close()
  return canvas.transferToImageBitmap()
}

function calculateTargetSize(
  originalWidth: number, 
  originalHeight: number, 
  options: SizeOptions
): { targetWidth: number; targetHeight: number } {
  let targetWidth = originalWidth
  let targetHeight = originalHeight

  // 处理最大边长限制
  if (options.maxSide) {
    const maxSide = options.maxSide
    if (originalWidth > maxSide || originalHeight > maxSide) {
      if (originalWidth > originalHeight) {
        targetWidth = maxSide
        targetHeight = Math.round((originalHeight * maxSide) / originalWidth)
      } else {
        targetHeight = maxSide
        targetWidth = Math.round((originalWidth * maxSide) / originalHeight)
      }
    }
  }

  // 处理指定宽高
  if (options.width || options.height) {
    if (options.keepAspect) {
      // 保持宽高比
      if (options.width && options.height) {
        // 两个都指定，按 fit 模式处理
        const aspectRatio = originalWidth / originalHeight
        const targetAspectRatio = options.width / options.height
        
        if (options.fit === 'cover') {
          if (aspectRatio > targetAspectRatio) {
            targetWidth = options.width
            targetHeight = Math.round(options.width / aspectRatio)
          } else {
            targetHeight = options.height
            targetWidth = Math.round(options.height * aspectRatio)
          }
        } else if (options.fit === 'contain') {
          if (aspectRatio > targetAspectRatio) {
            targetHeight = options.height
            targetWidth = Math.round(options.height * aspectRatio)
          } else {
            targetWidth = options.width
            targetHeight = Math.round(options.width / aspectRatio)
          }
        } else {
          // stretch
          targetWidth = options.width
          targetHeight = options.height
        }
      } else if (options.width) {
        targetWidth = options.width
        targetHeight = Math.round((originalHeight * options.width) / originalWidth)
      } else if (options.height) {
        targetHeight = options.height
        targetWidth = Math.round((originalWidth * options.height) / originalHeight)
      }
    } else {
      // 不保持宽高比
      if (options.width) targetWidth = options.width
      if (options.height) targetHeight = options.height
    }
  }

  // 处理放大限制
  if (options.upscaleLimit) {
    const scaleX = targetWidth / originalWidth
    const scaleY = targetHeight / originalHeight
    const maxScale = options.upscaleLimit
    
    if (scaleX > maxScale || scaleY > maxScale) {
      if (scaleX > scaleY) {
        targetWidth = Math.round(originalWidth * maxScale)
        targetHeight = Math.round(originalHeight * maxScale)
      } else {
        targetHeight = Math.round(originalHeight * maxScale)
        targetWidth = Math.round(originalWidth * maxScale)
      }
    }
  }

  return { targetWidth, targetHeight }
}
