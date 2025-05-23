
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, Play, AlertCircle, Eye, EyeOff } from 'lucide-react';

const LiveDetection = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState<Array<{ id: string; type: string; confidence: number; timestamp: Date }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [facesDetected, setFacesDetected] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulate detection results
  const simulateDetection = () => {
    if (!isDetecting) return;

    const detectionTypes = ['Face', 'Person', 'Object', 'Motion'];
    const randomType = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
    const confidence = 0.7 + Math.random() * 0.3;

    const newDetection = {
      id: Math.random().toString(36).substr(2, 9),
      type: randomType,
      confidence,
      timestamp: new Date(),
    };

    setDetections(prev => [newDetection, ...prev.slice(0, 9)]);
    
    if (randomType === 'Face') {
      setFacesDetected(prev => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDetecting) {
      interval = setInterval(simulateDetection, 2000 + Math.random() * 3000);
    }
    return () => clearInterval(interval);
  }, [isDetecting]);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsDetecting(false);
    setFacesDetected(0);
  };

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
  };

  return (
    <div className="space-y-6">
      {/* Camera Control Panel */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Live Camera Detection</h3>
          <div className="flex items-center space-x-3">
            {isStreaming && (
              <button
                onClick={toggleDetection}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isDetecting
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isDetecting ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isDetecting ? 'Stop Detection' : 'Start Detection'}</span>
              </button>
            )}
            
            <button
              onClick={isStreaming ? stopCamera : startCamera}
              className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                isStreaming
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg text-white'
              }`}
            >
              {isStreaming ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isStreaming ? 'Stop Camera' : 'Start Camera'}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Camera Feed */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
          {isStreaming ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Detection Overlay */}
              {isDetecting && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Scanning Animation */}
                  <div className="absolute inset-4 border-2 border-green-400 rounded-xl animate-pulse">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-xl"></div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Detecting...</span>
                    </div>
                  </div>

                  {/* Face Count */}
                  {facesDetected > 0 && (
                    <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {facesDetected} Face{facesDetected !== 1 ? 's' : ''} Detected
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Camera className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Camera is off</p>
              <p className="text-sm">Click "Start Camera" to begin</p>
            </div>
          )}
        </div>
      </div>

      {/* Detection Results */}
      {detections.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Detections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detections.map((detection) => (
              <div key={detection.id} className="bg-white/50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{detection.type}</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(detection.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                    style={{ width: `${detection.confidence * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {detection.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDetection;
