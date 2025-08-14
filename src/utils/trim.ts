import { TrimOptions } from '../types'

export async function applyTrim(bitmap: ImageBitmap, options: TrimOptions): Promise<ImageBitmap> {
  if (!options.enabled) return bitmap

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0)
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { x, y, width, height } = findTrimBounds(imageData, options)
  
  // 添加内边距
  const padding = options.padding
  const finalX = Math.max(0, x - padding)
  const finalY = Math.max(0, y - padding)
  const finalWidth = Math.min(canvas.width - finalX, width + padding * 2)
  const finalHeight = Math.min(canvas.height - finalY, height + padding * 2)
  
  // 如果裁剪区域无效，返回原图
  if (finalWidth <= 0 || finalHeight <= 0) {
    bitmap.close()
    return canvas.transferToImageBitmap()
  }
  
  // 创建裁剪后的 canvas
  const cropCanvas = new OffscreenCanvas(finalWidth, finalHeight)
  const cropCtx = cropCanvas.getContext('2d')!
  cropCtx.drawImage(canvas, finalX, finalY, finalWidth, finalHeight, 0, 0, finalWidth, finalHeight)
  
  // 清理原 bitmap
  bitmap.close()
  return cropCanvas.transferToImageBitmap()
}

function findTrimBounds(imageData: ImageData, options: TrimOptions): { x: number; y: number; width: number; height: number } {
  const { data, width, height } = imageData
  const tolerance = options.tolerance
  
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  
  if (options.mode === 'transparent') {
    // 透明模式：查找第一个非透明像素
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const alpha = data[index + 3]
        
        if (alpha > tolerance) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }
  } else {
    // 纯色模式：查找与指定颜色不同的像素
    const targetColor = parseColor(options.solidColor || '#ffffff')
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        
        const colorDiff = Math.abs(r - targetColor.r) + 
                         Math.abs(g - targetColor.g) + 
                         Math.abs(b - targetColor.b)
        
        if (colorDiff > tolerance * 3) { // 容差乘以3（RGB三个通道）
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  }
}

function parseColor(color: string): { r: number; g: number; b: number } {
  // 简单的颜色解析，支持 #RRGGBB 格式
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return { r, g, b }
  }
  
  // 默认白色
  return { r: 255, g: 255, b: 255 }
}
