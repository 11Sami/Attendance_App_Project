import React, { useRef, useEffect, useState } from 'react';
import { CameraIcon, ArrowUturnLeftIcon, ExclamationTriangleIcon } from './icons/Icons';

interface CameraViewProps {
  onCapture: (imageBlob: Blob, capturedAt: Date) => void;
  onBack: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera: ", err);
          const error = err as Error;
          let message = "Could not access the camera. Please grant permission in your browser settings.";
          if(error.name === 'NotAllowedError') {
              message = "Camera access was denied. You must grant permission to check in.";
          } else if (error.name === 'NotFoundError') {
              message = "No camera was found on this device.";
          }
          setCameraError(message);
        }
      } else {
          setCameraError("Your browser does not support camera access.");
      }
    };
    
    setupCamera();

    return () => {
      // Cleanup: stop media streams when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const videoRatio = video.videoWidth / video.videoHeight;
      canvas.width = 1280; // Standard width
      canvas.height = canvas.width / videoRatio;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the canvas horizontally for a mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Flip back to draw text normally
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
        
        const capturedAt = new Date();
        const timestamp = capturedAt.toLocaleString();
        context.font = 'bold 32px Arial';
        const textMetrics = context.measureText(timestamp);
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(10, canvas.height - 60, textMetrics.width + 20, 50);
        context.fillStyle = 'white';
        context.fillText(timestamp, 20, canvas.height - 25);

        canvas.toBlob(blob => {
          if (blob) {
            onCapture(blob, capturedAt);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="relative bg-black">
       <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-auto aspect-video object-cover transform -scale-x-100 cursor-pointer"
        onClick={handleCaptureClick}
        />
       
       <canvas ref={canvasRef} className="hidden" />

       {cameraError && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-center p-4">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-red-400">Camera Error</h3>
                <p className="text-slate-300 mt-2 max-w-sm">{cameraError}</p>
                 <button onClick={onBack} className="mt-6 flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition">
                    <ArrowUturnLeftIcon className="h-5 w-5" />
                    <span>Go Back</span>
                </button>
            </div>
       )}
       
       {!cameraError && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex items-center justify-center pointer-events-none">
            <button
                onClick={handleCaptureClick}
                className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 active:scale-100 ring-4 ring-offset-4 ring-offset-black/20 ring-cyan-500 pointer-events-auto"
                aria-label="Take picture"
            >
                <CameraIcon className="h-10 w-10 text-slate-800" />
            </button>
            <button onClick={onBack} className="absolute left-6 bottom-9 flex items-center gap-2 text-white/80 hover:text-white transition text-sm pointer-events-auto">
                <ArrowUturnLeftIcon className="h-5 w-5" />
                <span>Back</span>
            </button>
        </div>
       )}
    </div>
  );
};

export default CameraView;