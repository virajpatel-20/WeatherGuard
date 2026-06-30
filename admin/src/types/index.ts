export type UserRole = 'user' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type AuthProvider = 'google' | 'github';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: AuthProvider;
  role: UserRole;
  status: UserStatus;
  telegramChatId?: string;
  telegramUsername?: string;
  location?: string;
  requestMessage?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
}

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export type AlertStatus = 'sent' | 'failed' | 'pending';

export interface WeatherAlert {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  status: AlertStatus;
  errorMessage?: string;
  createdAt: string;
}
