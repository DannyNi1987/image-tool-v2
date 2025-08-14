import { ToolOptions } from '../types'

// 默认工具选项
export const defaultToolOptions: ToolOptions = {
  format: {
    format: 'jpeg',
    quality: 80,
    keepMetadata: false
  },
  size: {
    enabled: false,
    keepAspect: true,
    fit: 'contain',
    resample: 'lanczos'
  },
  transform: {
    enabled: false,
    rotate: 0,
    flipH: false,
    flipV: false
  },
  watermark: {
    enabled: false,
    text: {
      content: 'BDWebTek',
      font: 'Arial',
      size: 16,
      weight: 400,
      color: '#000000',
      opacity: 0.7,
      pos: 'bottom-right',
      x: 10,
      y: 10,
      rotation: 0
    }
  },
  trim: {
    enabled: false,
    mode: 'transparent',
    tolerance: 10,
    padding: 0
  },
  rename: {
    enabled: false,
    pattern: 'image_{n}',
    startIndex: 1,
    case: 'none'
  },
  download: {
    zipAll: false,
    zipName: 'converted_images'
  }
}

// 默认预设
export const defaultPresets: Record<string, ToolOptions> = {
  'web-optimized': {
    ...defaultToolOptions,
    format: {
      format: 'webp',
      quality: 85,
      keepMetadata: false
    },
    size: {
      enabled: true,
      width: 1920,
      height: 1080,
      keepAspect: true,
      fit: 'contain',
      resample: 'lanczos'
    }
  },
  'high-quality': {
    ...defaultToolOptions,
    format: {
      format: 'jpeg',
      quality: 95,
      keepMetadata: true
    }
  },
  'small-size': {
    ...defaultToolOptions,
    format: {
      format: 'avif',
      quality: 70,
      keepMetadata: false
    },
    size: {
      enabled: true,
      width: 800,
      height: 600,
      keepAspect: true,
      fit: 'contain',
      resample: 'lanczos'
    }
  },
  'social-media': {
    ...defaultToolOptions,
    format: {
      format: 'jpeg',
      quality: 85,
      keepMetadata: false
    },
    size: {
      enabled: true,
      width: 1200,
      height: 630,
      keepAspect: true,
      fit: 'cover',
      resample: 'lanczos'
    },
    watermark: {
      enabled: true,
      text: {
        content: 'BDWebTek',
        font: 'Arial',
        size: 20,
        weight: 600,
        color: '#ffffff',
        opacity: 0.8,
        pos: 'bottom-right',
        x: 20,
        y: 20,
        rotation: 0
      }
    }
  }
}
