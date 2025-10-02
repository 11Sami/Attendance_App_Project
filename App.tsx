import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, UserData, LocationData, AttendanceRecord, UserRole } from './types';
import DetailsForm from './components/DetailsForm';
import CameraView from './components/CameraView';
import AttendanceCard from './components/AttendanceCard';
import RoleSelection from './components/RoleSelection';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import PreviewView from './components/PreviewView';
import { getAddressFromCoordinates } from './services/geminiService';
import { ArrowLeftOnRectangleIcon } from './components/icons/Icons';
import { loadRecords, saveRecords } from './services/storageService';


const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.ROLE_SELECTION);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [capturedImageData, setCapturedImageData] = useState<{ blob: Blob, dataUrl: string, timestamp: Date } | null>(null);
  const [currentAttendanceRecord, setCurrentAttendanceRecord] = useState<AttendanceRecord | null>(null);
  const [allAttendanceRecords, setAllAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    // Load records from local storage when the app starts
    const records = loadRecords();
    setAllAttendanceRecords(records);
  }, []);


  const handleRoleSelect = (role: UserRole) => {
    setCurrentUserRole(role);
    setStep(role === UserRole.ADMIN ? AppStep.ADMIN_LOGIN : AppStep.DETAILS);
  };
  
  const handleAdminLogin = (success: boolean) => {
    if (success) {
        setStep(AppStep.ADMIN_DASHBOARD);
        setError(null);
    } else {
        setError("Invalid username or password.");
    }
  }

  const handleDetailsSubmit = (data: UserData) => {
    setUserData(data);
    setStep(AppStep.CAMERA);
    setError(null);
  };
  
  const handlePhotoTaken = (imageBlob: Blob, capturedAt: Date) => {
     const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setCapturedImageData({ blob: imageBlob, dataUrl: base64data, timestamp: capturedAt });
        setStep(AppStep.PREVIEW);
      };
      reader.onerror = () => {
          setError("Failed to process the captured image.");
          setStep(AppStep.CAMERA);
      }
  };
  
  const handleSubmitAttendance = useCallback(async () => {
    if (!userData || !capturedImageData) {
      setError("Data is missing. Please start over.");
      setStep(AppStep.DETAILS);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const location = await new Promise<LocationData>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser."));
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
            (err) => reject(new Error(`Location Error: ${err.message}`)),
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
          );
        }
      });
      
      const address = await getAddressFromCoordinates(location.latitude, location.longitude);
      
      const newRecord: AttendanceRecord = {
        id: capturedImageData.timestamp.getTime().toString(),
        ...userData,
        checkInTime: capturedImageData.timestamp,
        location: { ...location, address },
        imageDataUrl: capturedImageData.dataUrl,
      };

      // Add new record and save the entire list to local storage
      const updatedRecords = [newRecord, ...allAttendanceRecords].sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());
      saveRecords(updatedRecords);

      setAllAttendanceRecords(updatedRecords);
      setCurrentAttendanceRecord(newRecord);
      setStep(AppStep.RESULT);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to capture attendance: ${errorMessage}. Please ensure you have granted location permissions and have a stable internet connection.`);
      setStep(AppStep.PREVIEW); 
    } finally {
      setIsProcessing(false);
    }
  }, [userData, capturedImageData, allAttendanceRecords]);

  const handleRetake = () => {
    setCapturedImageData(null);
    setError(null);
    setStep(AppStep.CAMERA);
  };

  const handleStartNewCheckin = () => {
    setStep(AppStep.DETAILS);
    setUserData(null);
    setCurrentAttendanceRecord(null);
    setCapturedImageData(null);
    setError(null);
    setIsProcessing(false);
  };
  
  const handleLogout = () => {
    setStep(AppStep.ROLE_SELECTION);
    setCurrentUserRole(null);
    setError(null);
    // Reset user-specific data
    setUserData(null);
    setCurrentAttendanceRecord(null);
    setCapturedImageData(null);
    setIsProcessing(false);
  };
  
  const handleBackToRoleSelection = () => {
    setStep(AppStep.ROLE_SELECTION);
    setCurrentUserRole(null);
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.ROLE_SELECTION:
        return <RoleSelection onSelectRole={handleRoleSelect} />;
      case AppStep.ADMIN_LOGIN:
        return <AdminLogin onSubmit={handleAdminLogin} onBack={handleBackToRoleSelection} error={error} />;
      case AppStep.DETAILS:
        return <DetailsForm onSubmit={handleDetailsSubmit} />;
      case AppStep.CAMERA:
        return <CameraView onCapture={handlePhotoTaken} onBack={handleStartNewCheckin} />;
      case AppStep.PREVIEW:
        return capturedImageData ? (
            <PreviewView 
                imageDataUrl={capturedImageData.dataUrl}
                onRetake={handleRetake}
                onSubmit={handleSubmitAttendance}
                isProcessing={isProcessing}
                processingError={error}
            />
        ) : null;
      case AppStep.RESULT:
        return currentAttendanceRecord ? (
          <AttendanceCard record={currentAttendanceRecord} onReset={handleStartNewCheckin} />
        ) : null;
      case AppStep.ADMIN_DASHBOARD:
        return <AdminDashboard records={allAttendanceRecords} />;
      default:
        return <RoleSelection onSelectRole={handleRoleSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800 font-sans">
       <div className={`w-full relative transition-all duration-300 ease-in-out ${step === AppStep.ADMIN_DASHBOARD ? 'max-w-5xl' : 'max-w-2xl'}`}>
         {currentUserRole && (
            <button 
              onClick={handleLogout} 
              className="absolute top-4 right-4 z-10 flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 bg-slate-800/50 hover:bg-slate-700/70 px-3 py-2 rounded-lg text-sm"
              aria-label="Logout"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
         )}
         <header className="text-center mb-8 pt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Secure Attendance Snap
            </h1>
            <p className="text-slate-400 mt-2">
              {currentUserRole === UserRole.ADMIN 
                ? "Administrator Dashboard" 
                : "Verifiable check-ins with live photo, time, and location."
              }
            </p>
         </header>
        <main className="w-full bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-lg border border-slate-700 overflow-hidden">
          {renderContent()}
        </main>
      </div>
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Secure Attendance Systems. All rights reserved.</p>
        <p className="mt-1">This application requires camera and high-accuracy location access for verification.</p>
      </footer>
    </div>
  );
};

export default App;