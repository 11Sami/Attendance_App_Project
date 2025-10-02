export enum AppStep {
  ROLE_SELECTION = 'role_selection',
  ADMIN_LOGIN = 'admin_login',
  DETAILS = 'details',
  CAMERA = 'camera',
  PREVIEW = 'preview',
  RESULT = 'result',
  ADMIN_DASHBOARD = 'admin_dashboard',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserData {
  employeeId: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface AttendanceRecord extends UserData {
  id: string;
  checkInTime: Date;
  location: LocationData;
  imageDataUrl: string;
}