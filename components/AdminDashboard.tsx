import React, { useState, useMemo } from 'react';
import { AttendanceRecord } from '../types';
import { MagnifyingGlassIcon, XCircleIcon } from './icons/Icons';

const AdminDashboard: React.FC<{ records: AttendanceRecord[] }> = ({ records }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');

  const filteredAndSortedRecords = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
        // If there's no search query, return all records sorted descending (newest first)
        return records; // Original records from App.tsx are already sorted descending
    }

    const lowercasedQuery = trimmedQuery.toLowerCase();
    const searched = records.filter(
        (r) =>
            r.employeeId.toLowerCase().includes(lowercasedQuery)
    );

    // For progress view, filter by time
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const timeFiltered = searched.filter((r) => {
      const checkInDate = r.checkInTime;
      switch (timeFilter) {
        case 'week':
          return checkInDate >= startOfWeek;
        case 'month':
          return checkInDate >= startOfMonth;
        case 'year':
          return checkInDate >= startOfYear;
        case 'all':
        default:
          return true;
      }
    });

    // Sort ascending (oldest first) to show progress
    return timeFiltered.sort((a, b) => a.checkInTime.getTime() - b.checkInTime.getTime());
  }, [records, searchQuery, timeFilter]);

  const FilterButton: React.FC<{
    label: string;
    filter: typeof timeFilter;
  }> = ({ label, filter }) => (
    <button
      onClick={() => setTimeFilter(filter)}
      className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
        timeFilter === filter
          ? 'bg-cyan-500 text-slate-900 font-bold'
          : 'bg-slate-600 hover:bg-slate-500 text-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 md:p-8 flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
            type="text"
            placeholder="Search by Employee ID to see progress..."
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                    setTimeFilter('all'); // Reset filter on new search
                }
            }}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pl-10 pr-10 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition duration-200"
        />
        {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <XCircleIcon className="h-5 w-5 text-slate-400 hover:text-white" />
            </button>
        )}
      </div>
      
      {searchQuery.trim() && (
        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
                <FilterButton label="This Week" filter="week" />
                <FilterButton label="This Month" filter="month" />
                <FilterButton label="This Year" filter="year" />
                <FilterButton label="All Time" filter="all" />
            </div>
            <p className="text-sm font-semibold text-cyan-300 flex-shrink-0 ml-2">
                {filteredAndSortedRecords.length} Record(s)
            </p>
          </div>
        </div>
      )}

      <div className="max-h-[60vh] overflow-y-auto overflow-x-auto rounded-lg border border-slate-700">
        {filteredAndSortedRecords.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-slate-300">No Records Found</h3>
            <p className="text-slate-400 mt-2">
              {searchQuery ? 'No matching records for your search.' : 'No users have checked in yet.'}
            </p>
          </div>
        ) : (
           <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-700 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3">Photo</th>
                    <th scope="col" className="px-6 py-3">Employee ID</th>
                    <th scope="col" className="px-6 py-3">Check-in Time</th>
                    <th scope="col" className="px-6 py-3">Location</th>
                </tr>
            </thead>
            <tbody>
                {filteredAndSortedRecords.map((record) => (
                    <tr key={record.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="p-4">
                            <img src={record.imageDataUrl} alt={`Snap for ${record.employeeId}`} className="w-12 h-12 object-cover rounded-md" />
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                            {record.employeeId}
                        </th>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {record.checkInTime.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 min-w-[300px]">
                            {record.location.address || 'N/A'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;