import { WatermarkOptions } from '../types'

export async function applyWatermark(bitmap: ImageBitmap, options: WatermarkOptions): Promise<ImageBitmap> {
  if (!options.enabled) return bitmap

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const ctx = canvas.getContext('2d')!
  
  // 绘制原图
  ctx.drawImage(bitmap, 0, 0)
  
  // 应用图片水印
  if (options.image?.blob) {
    await applyImageWatermark(ctx, options.image, bitmap.width, bitmap.height)
  }
  
  // 应用文字水印
  if (options.text?.content) {
    applyTextWatermark(ctx, options.text, bitmap.width, bitmap.height)
  }
  
  // 清理原 bitmap
  bitmap.close()
  return canvas.transferToImageBitmap()
}

async function applyImageWatermark(
  ctx: OffscreenCanvasRenderingContext2D,
  imageOptions: NonNullable<WatermarkOptions['image']>,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!imageOptions.blob) return
  
  try {
    const watermarkBitmap = await createImageBitmap(imageOptions.blob)
    
    // 计算位置
    const { x, y } = calculatePosition(
      imageOptions.pos,
      canvasWidth,
      canvasHeight,
      watermarkBitmap.width * imageOptions.scale,
      watermarkBitmap.height * imageOptions.scale,
      imageOptions.x,
      imageOptions.y
    )
    
    // 设置透明度
    ctx.globalAlpha = imageOptions.opacity / 100
    
    // 应用旋转
    if (imageOptions.rotation !== 0) {
      ctx.save()
      const centerX = x + (watermarkBitmap.width * imageOptions.scale) / 2
      const centerY = y + (watermarkBitmap.height * imageOptions.scale) / 2
      ctx.translate(centerX, centerY)
      ctx.rotate((imageOptions.rotation * Math.PI) / 180)
      ctx.drawImage(
        watermarkBitmap,
        -(watermarkBitmap.width * imageOptions.scale) / 2,
        -(watermarkBitmap.height * imageOptions.scale) / 2,
        watermarkBitmap.width * imageOptions.scale,
        watermarkBitmap.height * imageOptions.scale
      )
      ctx.restore()
    } else {
      ctx.drawImage(
        watermarkBitmap,
        x,
        y,
        watermarkBitmap.width * imageOptions.scale,
        watermarkBitmap.height * imageOptions.scale
      )
    }
    
    // 恢复透明度
    ctx.globalAlpha = 1
    watermarkBitmap.close()
  } catch (error) {
    console.warn('Failed to apply image watermark:', error)
  }
}

function applyTextWatermark(
  ctx: OffscreenCanvasRenderingContext2D,
  textOptions: NonNullable<WatermarkOptions['text']>,
  canvasWidth: number,
  canvasHeight: number
) {
  // 设置字体
  ctx.font = `${textOptions.weight} ${textOptions.size}px ${textOptions.font}`
  ctx.fillStyle = textOptions.color
  ctx.globalAlpha = textOptions.opacity / 100
  
  // 计算文本尺寸
  const metrics = ctx.measureText(textOptions.content)
  const textWidth = metrics.width
  const textHeight = textOptions.size
  
  // 计算位置
  const { x, y } = calculatePosition(
    textOptions.pos,
    canvasWidth,
    canvasHeight,
    textWidth,
    textHeight,
    textOptions.x,
    textOptions.y
  )
  
  // 应用旋转
  if (textOptions.rotation !== 0) {
    ctx.save()
    ctx.translate(x + textWidth / 2, y + textHeight / 2)
    ctx.rotate((textOptions.rotation * Math.PI) / 180)
    ctx.fillText(textOptions.content, -textWidth / 2, textHeight / 2)
    ctx.restore()
  } else {
    ctx.fillText(textOptions.content, x, y + textHeight)
  }
  
  // 恢复透明度
  ctx.globalAlpha = 1
}

function calculatePosition(
  pos: string,
  canvasWidth: number,
  canvasHeight: number,
  elementWidth: number,
  elementHeight: number,
  offsetX: number,
  offsetY: number
): { x: number; y: number } {
  let x = 0
  let y = 0
  
  switch (pos) {
    case 'top-left':
      x = offsetX
      y = offsetY
      break
    case 'top-center':
      x = (canvasWidth - elementWidth) / 2 + offsetX
      y = offsetY
      break
    case 'top-right':
      x = canvasWidth - elementWidth - offsetX
      y = offsetY
      break
    case 'center-left':
      x = offsetX
      y = (canvasHeight - elementHeight) / 2 + offsetY
      break
    case 'center':
      x = (canvasWidth - elementWidth) / 2 + offsetX
      y = (canvasHeight - elementHeight) / 2 + offsetY
      break
    case 'center-right':
      x = canvasWidth - elementWidth - offsetX
      y = (canvasHeight - elementHeight) / 2 + offsetY
      break
    case 'bottom-left':
      x = offsetX
      y = canvasHeight - elementHeight - offsetY
      break
    case 'bottom-center':
      x = (canvasWidth - elementWidth) / 2 + offsetX
      y = canvasHeight - elementHeight - offsetY
      break
    case 'bottom-right':
    default:
      x = canvasWidth - elementWidth - offsetX
      y = canvasHeight - elementHeight - offsetY
      break
  }
  
  return { x, y }
}
