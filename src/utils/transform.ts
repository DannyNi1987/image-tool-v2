import { TransformOptions, OutputFormat } from '../types'

export async function applyTransform(
  bitmap: ImageBitmap, 
  options: TransformOptions, 
  outputFormat: OutputFormat
): Promise<ImageBitmap> {
  if (!options.enabled) return bitmap

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const ctx = canvas.getContext('2d')!
  
  // 如果输出为 JPEG 且有透明区域，先填充背景色
  if (outputFormat === 'jpeg' && options.canvasBg) {
    ctx.fillStyle = options.canvasBg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // 应用变换
  ctx.save()
  
  // 移动到中心点进行旋转
  ctx.translate(canvas.width / 2, canvas.height / 2)
  
  // 旋转
  if (options.rotate !== 0) {
    const radians = (options.rotate * Math.PI) / 180
    ctx.rotate(radians)
  }
  
  // 翻转
  if (options.flipH || options.flipV) {
    const scaleX = options.flipH ? -1 : 1
    const scaleY = options.flipV ? -1 : 1
    ctx.scale(scaleX, scaleY)
  }
  
  // 绘制图像
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2)
  ctx.restore()
  
  // 应用裁剪
  if (options.crop) {
    const { x, y, w, h } = options.crop
    const cropCanvas = new OffscreenCanvas(w, h)
    const cropCtx = cropCanvas.getContext('2d')!
    cropCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h)
    
    // 清理原 bitmap
    bitmap.close()
    return cropCanvas.transferToImageBitmap()
  }
  
  // 清理原 bitmap
  bitmap.close()
  return canvas.transferToImageBitmap()
}
