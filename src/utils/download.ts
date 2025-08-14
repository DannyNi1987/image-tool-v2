/**
 * 下载 Blob 文件
 * @param blob 要下载的文件内容
 * @param filename 文件名
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  
  // 延迟回收对象 URL，避免内存泄漏
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * 批量下载文件（逐个下载）
 * @param files 文件列表
 */
export async function downloadMultipleFiles(files: { blob: Blob; name: string }[]) {
  for (const file of files) {
    downloadBlob(file.blob, file.name)
    // 添加小延迟，避免浏览器阻止多个下载
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}
