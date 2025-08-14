// ZIP 工具函数

import JSZip from 'jszip'
import { downloadBlob } from './download'

/**
 * 将文件列表打包为 ZIP 并下载
 * @param files 文件列表
 * @param zipName ZIP 文件名
 * @param onProgress 进度回调（可选）
 */
export async function zipAndDownload(
  files: { name: string; blob: Blob }[], 
  zipName: string = 'converted-images.zip',
  onProgress?: (current: number, total: number) => void
) {
  const zip = new JSZip()
  
  // 逐个添加文件，避免一次性占用过多内存
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    zip.file(file.name, file.blob)
    
    // 报告进度
    if (onProgress) {
      onProgress(i + 1, files.length)
    }
    
    // 小延迟，让出主线程
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }
  
  // 生成 ZIP 文件
  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  })
  
  // 下载 ZIP 文件
  downloadBlob(zipBlob, zipName)
  
  return zipBlob
}

/**
 * 检查文件列表是否可以打包
 * @param files 文件列表
 */
export function canCreateZip(files: { blob?: Blob; name?: string }[]): boolean {
  return files.some(file => file.blob && file.name)
}

