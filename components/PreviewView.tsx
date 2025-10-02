import React from 'react';
import { ArrowPathIcon, ArrowUturnLeftIcon, CheckCircleIcon } from './icons/Icons';

interface PreviewViewProps {
  imageDataUrl: string;
  onRetake: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
  processingError: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4 z-20">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-semibold">Submitting Attendance...</p>
        <p className="text-sm text-slate-300">Getting location and generating record.</p>
    </div>
);

const PreviewView: React.FC<PreviewViewProps> = ({ imageDataUrl, onRetake, onSubmit, isProcessing, processingError }) => {
  return (
    <div className="p-6 md:p-8 relative">
        {isProcessing && <LoadingSpinner />}
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-300">Confirm Your Photo</h2>
            <p className="text-slate-400">Looks good? Submit your attendance or retake the picture.</p>
        </div>
        
        <img src={imageDataUrl} alt="Attendance preview" className="w-full h-auto rounded-lg border-2 border-slate-600" />
        
        {processingError && <p className="text-red-400 text-sm text-center mt-4">{processingError}</p>}
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
                onClick={onRetake}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                <span>Retake Picture</span>
            </button>
            <button
                onClick={onSubmit}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
            >
                <CheckCircleIcon className="h-5 w-5" />
                <span>Submit Attendance</span>
            </button>
        </div>
    </div>
  );
};

export default PreviewView;
