import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useFiles, useSelectedFiles } from '../store/useStore'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const files = useFiles()
  const selectedFiles = useSelectedFiles()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const currentFile = selectedFiles.length > 0 ? files.find(f => f.id === selectedFiles[currentIndex]) : null

  useEffect(() => {
    if (currentFile && currentFile.arrayBuffer) {
      const blob = new Blob([currentFile.arrayBuffer], { type: currentFile.type })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [currentFile])

  const handlePrevious = () => {
    if (selectedFiles.length > 1) {
      setCurrentIndex(prev => prev > 0 ? prev - 1 : selectedFiles.length - 1)
    }
  }

  const handleNext = () => {
    if (selectedFiles.length > 1) {
      setCurrentIndex(prev => prev < selectedFiles.length - 1 ? prev + 1 : 0)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!currentFile) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-lg font-body-medium text-primary-title">
                    {currentFile.name}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Image Preview */}
                <div className="relative">
                  <div className="flex justify-center items-center p-8">
                    <img
                      src={previewUrl}
                      alt={currentFile.name}
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>

                  {/* Navigation Arrows */}
                  {selectedFiles.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                        aria-label="上一张"
                      >
                        <ChevronLeftIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                        aria-label="下一张"
                      >
                        <ChevronRightIcon className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      {currentIndex + 1} / {selectedFiles.length}
                    </span>
                    <span>
                      {(currentFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PreviewModal
