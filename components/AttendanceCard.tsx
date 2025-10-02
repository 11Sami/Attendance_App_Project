import React from 'react';
import type { AttendanceRecord } from '../types';
import { UserCircleIcon, ClockIcon, MapPinIcon, ArrowPathIcon } from './icons/Icons';

interface AttendanceCardProps {
  record: AttendanceRecord;
  onReset: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-cyan-400 mt-1">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      <p className="text-base text-white">{value}</p>
    </div>
  </div>
);

const AttendanceCard: React.FC<AttendanceCardProps> = ({ record, onReset }) => {
  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">Check-in Successful!</h2>
        <p className="text-slate-400">Your attendance has been recorded.</p>
      </div>
      <div className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600">
        <img src={record.imageDataUrl} alt="Attendance snapshot" className="w-full h-auto" />
        <div className="p-6 space-y-4">
          <InfoRow 
            icon={<UserCircleIcon className="h-6 w-6" />}
            label="Employee ID"
            value={record.employeeId}
          />
          <InfoRow 
            icon={<ClockIcon className="h-6 w-6" />}
            label="Check-in Time"
            value={record.checkInTime.toLocaleString()}
          />
          <InfoRow 
            icon={<MapPinIcon className="h-6 w-6" />}
            label="Check-in Location"
            value={record.location.address || 'Resolving address...'}
          />
        </div>
      </div>
      <button
        onClick={onReset}
        className="w-full mt-8 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
      >
        <ArrowPathIcon className="h-5 w-5" />
        <span>New Check-in</span>
      </button>
    </div>
  );
};

export default AttendanceCard;