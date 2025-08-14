import { useOptions, useOptionActions } from '../../store/useStore'

const DownloadPanel: React.FC = () => {
  const options = useOptions()
  const { updateOptions } = useOptionActions()

  return (
    <div className="space-y-4">
      <h3 className="font-body-medium text-primary-title">下载设置</h3>
      
      {/* 下载方式 */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="download"
            checked={!options.download.zipAll}
            onChange={() => updateOptions({
              download: { ...options.download, zipAll: false }
            })}
          />
          <span className="text-sm text-primary-text">单独下载文件</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="download"
            checked={options.download.zipAll}
            onChange={() => updateOptions({
              download: { ...options.download, zipAll: true }
            })}
          />
          <span className="text-sm text-primary-text">打包为 ZIP 下载</span>
        </label>
      </div>

      {/* ZIP 文件名 */}
      {options.download.zipAll && (
        <div>
          <label className="block text-sm text-primary-text mb-1">ZIP 文件名</label>
          <input
            type="text"
            value={options.download.zipName}
            onChange={(e) => updateOptions({
              download: { ...options.download, zipName: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="converted-images.zip"
          />
        </div>
      )}

      {/* 下载选项说明 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Individual files:</strong> 每个文件单独下载<br/>
          <strong>ZIP all:</strong> 将所有文件打包为 ZIP 下载
        </p>
      </div>
    </div>
  )
}

export default DownloadPanel

