import { useState } from 'react'
import { useFiles, useOptions, useFileActions } from '../store/useStore'
import { downloadBlob } from '../utils/download'
import { zipAndDownload } from '../utils/zip'
import { savePreset, loadPresets, exportAllPresets } from '../utils/presets'

const TestPanel: React.FC = () => {
  const files = useFiles()
  const options = useOptions()
  const { addFiles } = useFileActions()
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const clearResults = () => {
    setTestResults([])
  }

  // 测试文件上传
  const testFileUpload = async () => {
    try {
      // 创建一个测试图片 Blob
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(0, 0, 100, 100)
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const testFile = new File([blob], 'test-image.png', { type: 'image/png' })
          await addFiles([testFile])
          addTestResult('✅ 文件上传测试通过')
        }
      })
    } catch (error) {
      addTestResult(`❌ 文件上传测试失败: ${error}`)
    }
  }

  // 测试预设保存
  const testPresetSave = () => {
    try {
      savePreset('test-preset', options)
      addTestResult('✅ 预设保存测试通过')
    } catch (error) {
      addTestResult(`❌ 预设保存测试失败: ${error}`)
    }
  }

  // 测试预设加载
  const testPresetLoad = () => {
    try {
      const presets = loadPresets()
      addTestResult(`✅ 预设加载测试通过，找到 ${Object.keys(presets).length} 个预设`)
    } catch (error) {
      addTestResult(`❌ 预设加载测试失败: ${error}`)
    }
  }

  // 测试预设导出
  const testPresetExport = () => {
    try {
      exportAllPresets()
      addTestResult('✅ 预设导出测试通过')
    } catch (error) {
      addTestResult(`❌ 预设导出测试失败: ${error}`)
    }
  }

  // 测试下载功能
  const testDownload = () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 50
      canvas.height = 50
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(0, 0, 50, 50)
      
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, 'test-download.png')
          addTestResult('✅ 下载功能测试通过')
        }
      })
    } catch (error) {
      addTestResult(`❌ 下载功能测试失败: ${error}`)
    }
  }

  // 测试 ZIP 功能
  const testZip = async () => {
    try {
      const canvas1 = document.createElement('canvas')
      canvas1.width = 50
      canvas1.height = 50
      const ctx1 = canvas1.getContext('2d')!
      ctx1.fillStyle = '#ff0000'
      ctx1.fillRect(0, 0, 50, 50)
      
      const canvas2 = document.createElement('canvas')
      canvas2.width = 50
      canvas2.height = 50
      const ctx2 = canvas2.getContext('2d')!
      ctx2.fillStyle = '#00ff00'
      ctx2.fillRect(0, 0, 50, 50)
      
      const blob1 = await new Promise<Blob>((resolve) => {
        canvas1.toBlob((blob) => resolve(blob!))
      })
      
      const blob2 = await new Promise<Blob>((resolve) => {
        canvas2.toBlob((blob) => resolve(blob!))
      })
      
      await zipAndDownload([
        { name: 'red.png', blob: blob1 },
        { name: 'green.png', blob: blob2 }
      ], 'test-zip.zip')
      
      addTestResult('✅ ZIP 功能测试通过')
    } catch (error) {
      addTestResult(`❌ ZIP 功能测试失败: ${error}`)
    }
  }

  // 运行所有测试
  const runAllTests = async () => {
    clearResults()
    addTestResult('🚀 开始运行所有测试...')
    
    await testFileUpload()
    testPresetSave()
    testPresetLoad()
    testPresetExport()
    testDownload()
    await testZip()
    
    addTestResult('🎉 所有测试完成！')
  }

  return (
    <div className="rounded-[12px] border border-panel-border bg-white shadow-panel p-6">
      <h3 className="text-lg font-title font-semibold text-primary mb-4">功能测试面板</h3>
      
      <div className="space-y-4">
        {/* 测试按钮 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button
            onClick={testFileUpload}
            className="px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm font-body"
          >
            测试文件上传
          </button>
          <button
            onClick={testPresetSave}
            className="px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm font-body"
          >
            测试预设保存
          </button>
          <button
            onClick={testPresetLoad}
            className="px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm font-body"
          >
            测试预设加载
          </button>
          <button
            onClick={testPresetExport}
            className="px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm font-body"
          >
            测试预设导出
          </button>
          <button
            onClick={testDownload}
            className="px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm font-body"
          >
            测试下载功能
          </button>
          <button
            onClick={testZip}
            className="px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm font-body"
          >
            测试 ZIP 功能
          </button>
        </div>
        
        {/* 运行所有测试 */}
        <div className="flex space-x-2">
          <button
            onClick={runAllTests}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-body font-medium"
          >
            运行所有测试
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 border border-panel-border text-text rounded-md hover:bg-gray-50 font-body font-medium"
          >
            清空结果
          </button>
        </div>
        
        {/* 测试结果 */}
        <div className="mt-4">
          <h4 className="font-body font-medium text-text mb-2">测试结果:</h4>
          <div className="bg-gray-50 rounded-md p-3 max-h-60 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-muted text-sm">暂无测试结果</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 当前状态 */}
        <div className="mt-4">
          <h4 className="font-body font-medium text-text mb-2">当前状态:</h4>
          <div className="text-sm text-muted space-y-1">
            <div>文件数量: {files.length}</div>
            <div>输出格式: {options.format.format}</div>
            <div>质量设置: {options.format.quality}%</div>
            <div>ZIP 下载: {options.download.zipAll ? '启用' : '禁用'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPanel
