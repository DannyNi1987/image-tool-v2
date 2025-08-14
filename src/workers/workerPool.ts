import { EncodeJob, WorkerEvent } from '../types'

const CONCURRENCY = Math.max(1, (navigator.hardwareConcurrency || 4) - 1)

export class WorkerPool {
  private workers: Worker[] = []
  private busy = new Set<number>()
  private queue: EncodeJob[] = []
  private listeners = new Map<string, (e: WorkerEvent) => void>() // 按 jobId 订阅
  private cancelled = new Set<string>()

  constructor(workerUrl: string, size = CONCURRENCY) {
    for (let i = 0; i < size; i++) {
      const w = new Worker(workerUrl, { type: 'module' })
      w.onmessage = (evt: MessageEvent<WorkerEvent>) => {
        const ev = evt.data
        if (ev.type === 'progress') {
          this.emit(ev.id, ev)
        } else if (ev.type === 'done' || ev.type === 'error') {
          this.busy.delete((w as any)._idx)
          this.emit(ev.id, ev)
          this.schedule()
        }
      }
      ;(w as any)._idx = i
      this.workers.push(w)
    }
  }

  on(jobId: string, cb: (e: WorkerEvent) => void) {
    this.listeners.set(jobId, cb)
  }

  off(jobId: string) {
    this.listeners.delete(jobId)
  }

  emit(jobId: string, e: WorkerEvent) {
    this.listeners.get(jobId)?.(e)
  }

  add(job: EncodeJob) {
    this.queue.push(job)
    this.schedule()
  }

  cancel(jobId: string) {
    this.cancelled.add(jobId)
  }

  private schedule() {
    for (const w of this.workers) {
      if (this.busy.has((w as any)._idx)) continue
      const job = this.queue.shift()
      if (!job) return
      if (this.cancelled.has(job.id)) continue // 跳过已取消的任务
      this.busy.add((w as any)._idx)
      w.postMessage(job, [job.arrayBuffer]) // 传输而非复制
    }
  }

  // 获取当前状态
  getStatus() {
    return {
      busy: this.busy.size,
      queue: this.queue.length,
      total: this.workers.length,
      cancelled: this.cancelled.size
    }
  }

  // 清理资源
  destroy() {
    this.workers.forEach(w => w.terminate())
    this.workers = []
    this.busy.clear()
    this.queue = []
    this.listeners.clear()
    this.cancelled.clear()
  }
}
