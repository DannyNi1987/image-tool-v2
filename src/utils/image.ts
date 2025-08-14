// 图像处理工具函数

export interface ImageInfo {
  width: number
  height: number
  type: string
  size: number
}

/**
 * 获取图像信息
 */
export function getImageInfo(file: File): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.width,
        height: img.height,
        type: file.type,
        size: file.size
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('无法加载图像'))
    }
    
    img.src = url
  })
}

/**
 * 创建图像预览 URL
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * 释放预览 URL
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url)
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * 检查是否为支持的图像格式
 */
export function isSupportedImageFormat(file: File): boolean {
  const supportedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/avif'
  ]
  return supportedTypes.includes(file.type)
}

/**
 * 根据格式获取 MIME 类型
 */
export function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif'
  }
  return mimeTypes[format] || 'image/jpeg'
}

/**
 * 生成文件名
 */
export function generateFileName(
  originalName: string,
  format: string,
  pattern?: string,
  startNumber?: number
): string {
  if (pattern) {
    const baseName = originalName.replace(/\.[^/.]+$/, '')
    const extension = format
    return pattern
      .replace('{n}', (startNumber || 1).toString())
      .replace('{name}', baseName) + '.' + extension
  }
  
  const baseName = originalName.replace(/\.[^/.]+$/, '')
  return `${baseName}.${format}`
}

