import { apiClient } from './client';
import type { User, AdminStats, WeatherAlert } from '../types';

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    const { data } = await apiClient.get<{ stats: AdminStats }>('/admin/stats');
    return data.stats;
  },

  async getPendingRequests(): Promise<User[]> {
    const { data } = await apiClient.get<{ users: User[] }>('/admin/pending');
    return data.users;
  },

  async getAllUsers(): Promise<User[]> {
    const { data } = await apiClient.get<{ users: User[] }>('/admin/users');
    return data.users;
  },

  async approveUser(userId: string): Promise<User> {
    const { data } = await apiClient.put<{ user: User }>(`/admin/users/${userId}/approve`);
    return data.user;
  },

  async rejectUser(userId: string): Promise<User> {
    const { data } = await apiClient.put<{ user: User }>(`/admin/users/${userId}/reject`);
    return data.user;
  },

  async getRecentAlerts(): Promise<WeatherAlert[]> {
    const { data } = await apiClient.get<{ alerts: WeatherAlert[] }>('/alerts');
    return data.alerts;
  },

  async triggerManualAlert(): Promise<{ sent: number; failed: number }> {
    const { data } = await apiClient.post<{ sent: number; failed: number; message: string }>('/alerts/trigger');
    return data;
  },
};

export const userApi = {
  async getMe(): Promise<User> {
    const { data } = await apiClient.get<{ user: User }>('/users/me');
    return data.user;
  },

  async updateProfile(payload: { location?: string; telegramChatId?: string }): Promise<User> {
    const { data } = await apiClient.put<{ user: User }>('/users/profile', payload);
    return data.user;
  },
};
