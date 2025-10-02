import { AttendanceRecord } from '../types';

const STORAGE_KEY = 'attendanceAppRecords';

// Load records from localStorage
export function loadRecords(): AttendanceRecord[] {
  try {
    const recordsJson = localStorage.getItem(STORAGE_KEY);
    if (!recordsJson) {
      return [];
    }
    const parsedRecords: any[] = JSON.parse(recordsJson);
    // Convert date strings back to Date objects
    return parsedRecords.map(record => ({
      ...record,
      checkInTime: new Date(record.checkInTime),
    })).sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());
  } catch (error) {
    console.error("Failed to load records from localStorage", error);
    // If parsing fails, clear the corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

// Save records to localStorage
export function saveRecords(records: AttendanceRecord[]): void {
  try {
    const recordsJson = JSON.stringify(records);
    localStorage.setItem(STORAGE_KEY, recordsJson);
  } catch (error) {
    console.error("Failed to save records to localStorage", error);
  }
}
