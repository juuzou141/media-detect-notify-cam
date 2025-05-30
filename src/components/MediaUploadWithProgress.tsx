
import React, { useState, useRef } from 'react';
import { Upload, Video, Image, X, AlertTriangle } from 'lucide-react';
import { apiService, UploadProgress } from '../services/api';
import ProgressTracker from './ProgressTracker';
import VideoPlayer from './VideoPlayer';
import { useToast } from '@/hooks/use-toast';

const MediaUploadWithProgress = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ percentage: 0, stage: 'Ready to upload' });
  const [isComplete, setIsComplete] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video or image file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsComplete(false);
    setHasError(false);
    setProcessedVideoUrl(null);
  };

  const startUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setHasError(false);

    try {
      const videoUrl = await apiService.uploadVideo(selectedFile, (progressData) => {
        setProgress(progressData);
      });

      setProcessedVideoUrl(videoUrl);
      setIsComplete(true);
      
      toast({
        title: "Processing Complete",
        description: "Your video has been analyzed for theft detection.",
      });

      // Simulate thief detection notification
      setTimeout(() => {
        toast({
          title: "⚠️ Thief Detected!",
          description: "Suspicious activity found in the uploaded video.",
          variant: "destructive",
        });
      }, 1000);

    } catch (error) {
      setHasError(true);
      setProgress({ percentage: 0, stage: 'Upload failed' });
      toast({
        title: "Upload Failed",
        description: "There was an error processing your video.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setProgress({ percentage: 0, stage: 'Ready to upload' });
    setIsComplete(false);
    setProcessedVideoUrl(null);
    setHasError(false);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) {
      return <Video className="w-8 h-8 text-blue-500" />;
    }
    return <Image className="w-8 h-8 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!selectedFile && (
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Upload Media for Theft Detection
          </h3>
          <p className="text-gray-500 mb-6">
            Drag and drop your video or image file here, or click to select
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Select File
          </button>
        </div>
      )}

      {/* Selected File Display */}
      {selectedFile && !isUploading && !isComplete && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getFileIcon(selectedFile)}
              <div>
                <h4 className="font-medium text-gray-800">{selectedFile.name}</h4>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={startUpload}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Start Analysis
              </button>
              <button
                onClick={resetUpload}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tracker */}
      {(isUploading || isComplete || hasError) && (
        <ProgressTracker
          percentage={progress.percentage}
          stage={progress.stage}
          isComplete={isComplete}
          hasError={hasError}
        />
      )}

      {/* Results */}
      {isComplete && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Analysis Complete</h3>
            <button
              onClick={resetUpload}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              Upload New File
            </button>
          </div>
          
          {processedVideoUrl && (
            <button
              onClick={() => setProcessedVideoUrl(processedVideoUrl)}
              className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Video className="w-5 h-5" />
              <span>View Processed Video</span>
            </button>
          )}
        </div>
      )}

      {/* Video Player Modal */}
      {processedVideoUrl && (
        <VideoPlayer
          videoUrl={processedVideoUrl}
          onClose={() => setProcessedVideoUrl(null)}
        />
      )}
    </div>
  );
};

export default MediaUploadWithProgress;
