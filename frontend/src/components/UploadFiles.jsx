import { useState } from 'react'
import axios from 'axios'
import supabase from '../supabase/supabase'
export default function UploadFiles() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadStatus, setUploadStatus] = useState({})

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    const initialStatus = {}
    files.forEach(file => {
      initialStatus[file.name] = {
        progress: 0,
        status: 'pending',
        error: null
      }
    })
    setUploadStatus(initialStatus)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('files', file)

        try {
          setUploadStatus(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'uploading' }
          }))
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;

          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_DOMAIN}/api/chat/upload-to-vector`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`
              },
              withCredentials: true,
              onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadStatus(prev => ({
                  ...prev,
                  [file.name]: { ...prev[file.name], progress }
                }))
              }
            }
          )

          setUploadStatus(prev => ({
            ...prev,
            [file.name]: { ...prev[file.name], status: 'completed', progress: 100 }
          }))

          return response
        } catch (error) {
          setUploadStatus(prev => ({
            ...prev,
            [file.name]: {
              ...prev[file.name],
              status: 'error',
              error: error.message
            }
          }))
          throw error
        }
      })

      await Promise.all(uploadPromises)
      setSelectedFiles([])
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }

  const removeFile = (index) => {
    const fileToRemove = selectedFiles[index]
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setUploadStatus(prev => {
      const newStatus = { ...prev }
      delete newStatus[fileToRemove.name]
      return newStatus
    })
  }

  const isUploading = Object.values(uploadStatus).some(
    status => status.status === 'uploading'
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Files</h2>
        <p className="text-gray-600">Upload your customer service scripts and guidelines</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept=".txt,.pdf,.doc,.docx,.csv"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer block"
        >
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">Click to upload files</p>
          <p className="text-sm text-gray-500">or drag and drop</p>
          <p className="text-xs text-gray-400 mt-2">PDF, TXT, DOC, DOCX, CSV up to 10MB</p>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  {uploadStatus[file.name]?.status !== 'uploading' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {uploadStatus[file.name] && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadStatus[file.name].status === 'completed' 
                            ? 'bg-green-600' 
                            : uploadStatus[file.name].status === 'error'
                            ? 'bg-red-600'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${uploadStatus[file.name].progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-600">
                        {uploadStatus[file.name].status === 'completed' && 'Upload complete'}
                        {uploadStatus[file.name].status === 'uploading' && `Uploading... ${uploadStatus[file.name].progress}%`}
                        {uploadStatus[file.name].status === 'error' && (
                          <span className="text-red-500">Error: {uploadStatus[file.name].error}</span>
                        )}
                      </p>
                      {uploadStatus[file.name].status === 'completed' && (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isUploading}
          className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  )
}
