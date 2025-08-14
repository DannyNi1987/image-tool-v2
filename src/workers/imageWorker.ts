// 图像处理 Web Worker
// 处理图像变换、调整大小、水印等操作

interface ImageWorkerMessage {
  id: string
  type: 'resize' | 'transform' | 'watermark' | 'trim'
  data: any
}

interface ResizeMessage extends ImageWorkerMessage {
  type: 'resize'
  data: {
    imageData: {
      data: Uint8ClampedArray;
      width: number;
      height: number;
    }
    width?: number
    height?: number
    maintainAspectRatio: boolean
  }
}

interface TransformMessage extends ImageWorkerMessage {
  type: 'transform'
  data: {
    imageData: {
      data: Uint8ClampedArray;
      width: number;
      height: number;
    }
    rotate: number
    flip: {
      horizontal: boolean
      vertical: boolean
    }
  }
}

interface WatermarkMessage extends ImageWorkerMessage {
  type: 'watermark'
  data: {
    imageData: {
      data: Uint8ClampedArray;
      width: number;
      height: number;
    }
    text: string
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    opacity: number
    fontSize: number
    color: string
  }
}

interface TrimMessage extends ImageWorkerMessage {
  type: 'trim'
  data: {
    imageData: {
      data: Uint8ClampedArray;
      width: number;
      height: number;
    }
    threshold: number
  }
}

self.onmessage = async (event: MessageEvent<ImageWorkerMessage>) => {
  const { id, type, data } = event.data

  try {
    let result: any

    switch (type) {
      case 'resize':
        result = await handleResize(data as ResizeMessage['data'])
        break
      case 'transform':
        result = await handleTransform(data as TransformMessage['data'])
        break
      case 'watermark':
        result = await handleWatermark(data as WatermarkMessage['data'])
        break
      case 'trim':
        result = await handleTrim(data as TrimMessage['data'])
        break
      default:
        throw new Error(`未知的消息类型: ${type}`)
    }

    self.postMessage({
      id,
      type: 'success',
      result
    })
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

async function handleResize(data: ResizeMessage['data']) {
  // TODO: 实现图像缩放
  // 使用 Canvas API 或 pica 进行高质量缩放
  console.log('缩放图像:', data)
  
  // 模拟缩放过程
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    width: data.width || 800,
    height: data.height || 600,
    data: new Uint8ClampedArray((data.width || 800) * (data.height || 600) * 4)
  }
}

async function handleTransform(data: TransformMessage['data']) {
  // TODO: 实现图像变换
  // 使用 Canvas API 进行旋转和翻转
  console.log('变换图像:', data)
  
  // 模拟变换过程
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    data: data.imageData.data
  }
}

async function handleWatermark(data: WatermarkMessage['data']) {
  // TODO: 实现水印添加
  // 使用 Canvas API 绘制水印文本
  console.log('添加水印:', data)
  
  // 模拟水印过程
  await new Promise(resolve => setTimeout(resolve, 400))
  
  return {
    data: data.imageData.data
  }
}

async function handleTrim(data: TrimMessage['data']) {
  // TODO: 实现自动裁剪
  // 检测边缘并裁剪空白区域
  console.log('裁剪图像:', data)
  
  // 模拟裁剪过程
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return {
    data: data.imageData.data,
    bounds: { x: 10, y: 10, width: 1900, height: 1060 }
  }
}

