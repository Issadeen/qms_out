/**
 * TypeScript type definitions for QMS app
 * Based on queue data from current app screenshots
 */

export interface QueueItem {
  id: string;
  queueNo: number;
  code: string; // e.g., "H10966", "PL1072"
  status: 'Dispatch' | 'Safety' | string;
  vehicleNumber: string; // e.g., "KDS815E-ZH6290"
  driverName: string; // e.g., "AMOS MUNGAI", "N/A"
  companyName: string; // e.g., "Hero Petroleum Limited"
  timestamp: string; // ISO date string
  createdAt?: string;
  updatedAt?: string;
}

export interface Depot {
  id: string;
  name: 'eldoret' | 'kisumu' | 'nakuru';
  displayName: string;
  baseUrl: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  depot: string;
  token?: string;
  lastLogin?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    token?: string;
  };
  error?: string;
  depot?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QueueFilters {
  status?: string;
  company?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface AppState {
  user: User | null;
  depot: string;
  queues: QueueItem[];
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  QueueList: undefined;
  QueueDetail: { queueId: string };
  Settings: undefined;
};

// Component prop types
export interface QueueCardProps {
  queue: QueueItem;
  onPress: (queue: QueueItem) => void;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}