// 数据类型定义

export type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif' | 'gif' | 'heic';

export interface FormatOptions {
  format: OutputFormat;
  quality?: number; // 0-100
  keepMetadata: boolean;
  progressive?: boolean;
}

export interface SizeOptions {
  enabled: boolean;
  width?: number; 
  height?: number; 
  keepAspect: boolean; 
  fit: 'contain'|'cover'|'stretch';
  maxSide?: number; 
  upscaleLimit?: number; 
  dpi?: number; 
  resample: 'lanczos'|'cubic'|'default';
}

export interface TransformOptions {
  enabled: boolean;
  rotate: number; // degrees
  flipH: boolean; 
  flipV: boolean;
  crop?: {x:number;y:number;w:number;h:number};
  canvasBg?: string; // e.g., '#ffffff'
}

export interface WatermarkOptions {
  enabled: boolean;
  text?: {
    content:string;
    font:string;
    size:number;
    weight:number;
    color:string;
    opacity:number;
    pos:string;
    x:number;
    y:number;
    rotation:number
  };
  image?: {
    blob?: Blob;
    scale:number;
    opacity:number;
    pos:string;
    x:number;
    y:number;
    rotation:number
  };
}

export interface TrimOptions {
  enabled: boolean;
  mode: 'transparent' | 'solid';
  solidColor?: string; 
  tolerance: number; 
  padding: number;
}

export interface RenameOptions {
  enabled: boolean; 
  pattern: string; 
  startIndex: number; 
  case?: 'lower'|'upper'|'none';
}

export interface DownloadOptions { 
  zipAll: boolean; 
  zipName: string; 
}

export interface ToolOptions {
  format: FormatOptions;
  size: SizeOptions;
  transform: TransformOptions;
  watermark: WatermarkOptions;
  trim: TrimOptions;
  rename: RenameOptions;
  download: DownloadOptions;
  _metadata?: {
    createdAt: string;
    updatedAt: string;
  };
}

export interface FileItem {
  id: string; 
  name: string; 
  type: string; 
  size: number;
  arrayBuffer?: ArrayBuffer; 
  imageBitmap?: ImageBitmap;
  status: 'queued'|'processing'|'done'|'error';
  error?: string; 
  resultBlob?: Blob; 
  outputName?: string; 
  meta?: Record<string,unknown>;
  progress?: number;
  result?: {
    blob: Blob;
    size: number;
    url: string;
  };
}

// Worker 消息契约

// main → worker
export interface EncodeJob { 
  id: string; 
  fileId: string; 
  options: ToolOptions; 
  arrayBuffer: ArrayBuffer; 
}

export type Stage = 'decode' | 'trim' | 'transform' | 'resize' | 'watermark' | 'encode' | 'finalize'

export type WorkerEvent =
  | { type: 'progress'; id: string; fileId: string; stage: Stage; progress: number } // 0-1
  | { type: 'done'; id: string; fileId: string; blob: Blob; outputMeta?: any }
  | { type: 'error'; id: string; fileId: string; error: string }

// worker → main
export interface EncodeResult { 
  id: string; 
  fileId: string; 
  success: boolean; 
  blob?: Blob; 
  outputMeta?: any; 
  error?: string; 
}

// 预设类型
export interface Preset {
  id: string;
  name: string;
  options: ToolOptions;
  createdAt: number;
  updatedAt: number;
}

// 队列状态
export interface QueueState {
  processing: boolean;
  jobs: string[];
  currentJob?: string;
}
