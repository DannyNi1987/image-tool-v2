import { RenameOptions } from '../types'

export function generateOutputName(
  originalName: string,
  options: RenameOptions,
  outputMeta: {
    width: number
    height: number
    format: string
  },
  index: number
): string {
  if (!options.enabled) {
    return originalName
  }

  const baseName = originalName.replace(/\.[^/.]+$/, '') // 移除扩展名
  const extension = originalName.split('.').pop() || ''
  
  let outputName = options.pattern
  
  // 替换变量
  outputName = outputName.replace(/\{base\}/g, baseName)
  outputName = outputName.replace(/\{ext\}/g, extension)
  outputName = outputName.replace(/\{w\}/g, outputMeta.width.toString())
  outputName = outputName.replace(/\{h\}/g, outputMeta.height.toString())
  outputName = outputName.replace(/\{seq\}/g, (options.startIndex + index).toString())
  outputName = outputName.replace(/\{date\}/g, new Date().toISOString().split('T')[0])
  
  // 应用大小写
  if (options.case === 'lower') {
    outputName = outputName.toLowerCase()
  } else if (options.case === 'upper') {
    outputName = outputName.toUpperCase()
  }
  
  // 添加输出格式扩展名
  const outputExt = getOutputExtension(outputMeta.format)
  if (!outputName.endsWith(`.${outputExt}`)) {
    outputName += `.${outputExt}`
  }
  
  return outputName
}

function getOutputExtension(format: string): string {
  switch (format) {
    case 'jpeg':
      return 'jpg'
    case 'png':
      return 'png'
    case 'webp':
      return 'webp'
    case 'avif':
      return 'avif'
    case 'gif':
      return 'gif'
    default:
      return 'jpg'
  }
}

// 生成批量文件名
export function generateBatchNames(
  originalNames: string[],
  options: RenameOptions,
  outputMeta: {
    width: number
    height: number
    format: string
  }
): string[] {
  return originalNames.map((name, index) => 
    generateOutputName(name, options, outputMeta, index)
  )
}
