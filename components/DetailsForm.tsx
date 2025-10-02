import React, { useState } from 'react';
import type { UserData } from '../types';
import { UserIcon, ArrowRightIcon } from './icons/Icons';

interface DetailsFormProps {
  onSubmit: (data: UserData) => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ onSubmit }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId.trim() === '') {
      setError('Employee ID is required.');
      return;
    }
    setError('');
    onSubmit({ employeeId });
  };

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyan-300">Start Your Check-in</h2>
        <p className="text-slate-400">Please enter your Employee ID to proceed.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition duration-200"
          />
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!employeeId}
        >
          <span>Proceed to Camera</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default DetailsForm;