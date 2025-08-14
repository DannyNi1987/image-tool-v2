import { EncodeJob, WorkerEvent } from '../types'
import { decodeImage } from '../utils/decode'
import { applyTrim } from '../utils/trim'
import { applyTransform } from '../utils/transform'
import { applyResize } from '../utils/resize'
import { applyWatermark } from '../utils/watermark'
import { encodeImage } from '../utils/encode'

self.onmessage = async (evt: MessageEvent<EncodeJob>) => {
  const job = evt.data
  let bitmap: ImageBitmap | null = null
  
  try {
    const post = (ev: WorkerEvent) => (self as any).postMessage(ev)
    
    // 1) 解码
    post({ type: 'progress', id: job.id, fileId: job.fileId, stage: 'decode', progress: 0 })
    const { bitmap: decodedBitmap } = await decodeImage(job.arrayBuffer)
    bitmap = decodedBitmap
    
    // 2) Trim
    if (job.options.trim.enabled) {
      post({ type: 'progress', id: job.id, fileId: job.fileId, stage: 'trim', progress: 0.1 })
      bitmap = await applyTrim(bitmap, job.options.trim)
    }
    
    // 3) Transform
    post({ type: 'progress', id: job.id, fileId: job.fileId, stage: 'transform', progress: 0.25 })
    bitmap = await applyTransform(bitmap, job.options.transform, job.options.format.format)
    
    // 4) Resize
    if (job.options.size.enabled) {
      post({ type: 'progress', id: job.id, fileId: job.fileId, stage: 'resize', progress: 0.45 })
      bitmap = await applyResize(bitmap, job.options.size)
    }
    
    // 5) Watermark
    if (job.options.watermark.enabled) {
      post({ type: 'progress', id: job.id, fileId: job.fileId, stage: 'watermark', progress: 0.65 })
      bitmap = await applyWatermark(bitmap, job.options.watermark)
    }
    
    // 6) Encode
    post({ type: 'progress', id: job.id, fileId: job.fileId, stage: 'encode', progress: 0.85 })
    const { blob, outputMeta } = await encodeImage(bitmap, job.options.format)
    
    // 7) Finalize
    post({ type: 'progress', id: job.id, fileId: job.fileId, stage: 'finalize', progress: 1.0 })
    
    post({ type: 'done', id: job.id, fileId: job.fileId, blob, outputMeta })
  } catch (err: any) {
    console.error('Worker processing error:', err)
    ;(self as any).postMessage({ 
      type: 'error', 
      id: job.id, 
      fileId: job.fileId, 
      error: String(err?.message || err) 
    })
  } finally {
    // 清理资源
    if (bitmap) {
      try {
        bitmap.close()
      } catch (e) {
        // 忽略关闭错误
      }
    }
  }
}

