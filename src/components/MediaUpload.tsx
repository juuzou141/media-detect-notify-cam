
import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, FileVideo, Check } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'other';
  progress: number;
}

const MediaUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): 'image' | 'video' | 'other' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'other';
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const fileType = getFileType(file);
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: fileType,
        progress: 0,
      };

      // Create preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === newFile.id ? { ...f, preview: e.target?.result as string } : f)
          );
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => {
            if (f.id === newFile.id && f.progress < 100) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100);
              if (newProgress === 100) {
                clearInterval(interval);
              }
              return { ...f, progress: newProgress };
            }
            return f;
          })
        );
      }, 500);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50/50 scale-105'
            : 'border-gray-300 bg-white/50 hover:border-blue-300 hover:bg-blue-50/30'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDragOver ? 'bg-blue-500 scale-110' : 'bg-gray-100'
          }`}>
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-white' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Drop your media files here
            </h3>
            <p className="text-gray-600 mb-4">
              Support for images, videos, and other media formats
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-gray-200">
                <div className="flex-shrink-0">
                  {file.type === 'image' && file.preview ? (
                    <img src={file.preview} alt={file.file.name} className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {file.type === 'image' ? (
                        <FileImage className="w-6 h-6 text-gray-400" />
                      ) : file.type === 'video' ? (
                        <FileVideo className="w-6 h-6 text-gray-400" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.file.size)}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.progress === 100 && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
