/**
 * QMS API Client for React Native
 * Based on the original Ionic 3 app endpoints and patterns
 */

export interface QMSApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  duration?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  depot?: string;
  data?: any;
  error?: string;
}

export interface QueueItem {
  id: string;
  queueNo: number;
  code: string;
  status: 'Dispatch' | 'Safety' | 'Completed' | string;
  vehicleNumber: string;
  driverName: string;
  companyName: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_CONFIG = {
  depots: ['eldoret', 'kisumu', 'nakuru'],
  baseUrls: {
    eldoret: 'https://qmseldoret.kpc.co.ke/',
    kisumu: 'https://qmskisumu.kpc.co.ke/',
    nakuru: 'https://qmsnakuru.kpc.co.ke/',
  },
  timeout: 30000, // Increased to 30 seconds for slow connections
  retries: 2,
};

export class QMSApiClient {
  private depot: string;
  private baseUrl: string;
  private timeout: number;
  private isAuthenticated: boolean = false;
  private authToken?: string;
  private currentDepot?: string;
  private currentBaseUrl?: string;

  constructor(depot: string = 'kisumu') {
    this.depot = depot.toLowerCase();
    this.baseUrl = API_CONFIG.baseUrls[this.depot as keyof typeof API_CONFIG.baseUrls];
    this.timeout = API_CONFIG.timeout;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = this.timeout
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private requestUrl(method: string): string {
    return `${this.baseUrl}${method}`;
  }

  async get<T = any>(method: string, params: Record<string, string> = {}): Promise<QMSApiResponse<T>> {
    const url = new URL(this.requestUrl(method));
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await this.fetchWithTimeout(url.toString());
      
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async post<T = any>(method: string, body: any = {}): Promise<QMSApiResponse<T>> {
    try {
      const response = await this.fetchWithTimeout(this.requestUrl(method), {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Login to a specific depot only (no fallback, no dummy data)
   */
  async loginToSpecificDepot(username: string, password: string, depot: string): Promise<LoginResponse> {
    try {
      console.log(`Attempting login to ${depot} depot...`);
      const baseUrl = API_CONFIG.baseUrls[depot as keyof typeof API_CONFIG.baseUrls];
      if (!baseUrl) {
        return {
          success: false,
          error: `Invalid depot: ${depot}`,
        };
      }
      const params = `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
      const url = `${baseUrl}apis/login${params}`;
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        // Match original Ionic app: status !== 1 means success
        if (data.status !== 1) {
          this.depot = depot;
          this.baseUrl = baseUrl;
          this.isAuthenticated = true;
          this.authToken = data.token || 'authenticated';
          this.currentDepot = depot;
          this.currentBaseUrl = baseUrl;
          console.log(`Login successful to ${depot}`, data);
          return {
            success: true,
            data,
            depot,
          };
        } else {
          console.log(`Login failed to ${depot}: status = ${data.status}`);
          return {
            success: false,
            error: `Authentication failed for ${depot}`,
          };
        }
      } else {
        console.log(`Login failed to ${depot}: HTTP ${response.status}`);
        return {
          success: false,
          error: `Authentication failed. HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      console.log(`Login error to ${depot}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network connection error',
      };
    }
  }

  /**
   * Login method that tries all depots in sequence until one succeeds
   * Based on the original app's multi-depot login logic
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const depots = ['kisumu', 'eldoret', 'nakuru'];
    
    for (const depot of depots) {
      try {
        console.log(`Attempting login to ${depot}...`);
        const baseUrl = API_CONFIG.baseUrls[depot as keyof typeof API_CONFIG.baseUrls];
        const params = `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
        const url = `${baseUrl}apis/login${params}`;

        const response = await this.fetchWithTimeout(url, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          
          // Match original Ionic app: status !== 1 means success
          if (data.status !== 1) {
            // Set authenticated but don't set specific depot yet
            this.isAuthenticated = true;
            this.authToken = data.token || 'authenticated';
          
            console.log(`Login successful across depots`, data);
            return {
              success: true,
              data,
              depot: 'multi', // Indicate multi-depot login success
            };
          } else {
            console.log(`Login failed to ${depot}: status = ${data.status}`);
            continue; // Try next depot
          }
        } else {
          console.log(`Login failed to ${depot}: HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`Login error to ${depot}:`, error);
        continue;
      }
    }

    return {
      success: false,
      error: 'Login failed on all depots',
    };
  }

  /**
   * Set working depot after login (matches original app flow)
   */
  setWorkingDepot(depot: string): void {
    if (API_CONFIG.baseUrls[depot as keyof typeof API_CONFIG.baseUrls]) {
      this.depot = depot.toLowerCase();
      this.baseUrl = API_CONFIG.baseUrls[depot as keyof typeof API_CONFIG.baseUrls];
      this.currentDepot = depot;
      this.currentBaseUrl = this.baseUrl;
      console.log(`Working depot set to: ${depot}`);
    }
  }

  /**
   * Get queue data - trying multiple possible endpoints
   * No dummy data - only real API responses
   */
  async getQueues(): Promise<QMSApiResponse<QueueItem[]>> {
    console.log('getQueues called, checking authentication...');
    if (!this.isAuthenticated) {
      console.log('Not authenticated, cannot fetch queue data');
      return {
        success: false,
        error: 'Not authenticated. Please login first.',
      };
    }

    console.log(`Fetching queue data from ${this.depot} depot`);
    // Match original Ionic app: GET handheld/broadqueues (not api/queue)
    const endpoint = 'handheld/broadqueues';
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {}),
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      console.log('Response from handheld/broadqueues:', data);
      if (response.ok) {
        if (data && data.content && Array.isArray(data.content)) {
          // Original app gets data from vc.content
          return { success: true, data: data.content };
        } else if (Array.isArray(data)) {
          return { success: true, data };
        } else if (data && typeof data === 'object' && data.message === '') {
          // Handle empty message response as success with empty queue
          console.log('Received empty queue response');
          return { success: true, data: [] };
        } else {
          return { success: true, data: [] }; // Default to empty array for any non-array response
        }
      } else {
        return {
          success: false,
          error: `Queue API error: HTTP ${response.status}`,
        };
      }
    } catch (error) {
      console.log('Error fetching /api/queue:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }


  /**
   * Get details for a specific queue item
   */
  async getQueueDetails(id: string): Promise<QMSApiResponse<QueueItem>> {
    return this.get<QueueItem>(`handheld/broadqueue/${id}`);
  }

  /**
   * Get detailed queue data for a specific broadqueue ID
   * This matches the original Ionic app pattern: handheld/broadqueue/{broadqueueId}
   */
  async getDetailedQueues(broadqueueId: string): Promise<QMSApiResponse<any[]>> {
    console.log(`Fetching detailed queues for broadqueue ID: ${broadqueueId}`);
    
    if (!this.isAuthenticated || !this.currentBaseUrl) {
      return {
        success: false,
        error: 'Not authenticated or no depot selected',
      };
    }

    try {
      // Match original Ionic app pattern: handheld/broadqueue/{broadqueueId}
      const endpoint = `handheld/broadqueue/${broadqueueId}`;
      const url = `${this.currentBaseUrl}${endpoint}`;
      
      console.log(`Fetching detailed queue data from: ${url}`);
      
      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Response from ${endpoint}:`, data);

        // Check if API returned successful data
        if (data && (data.status === 1 || data.content)) {
          return {
            success: true,
            data: data.content || data,
          };
        } else {
          return {
            success: false,
            error: data.message || 'No detailed queue data available',
          };
        }
      } else {
        return {
          success: false,
          error: `Detailed queue API error: HTTP ${response.status}`,
        };
      }
    } catch (error) {
      console.log('Error fetching detailed queues:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): boolean {
    console.log('Checking auth status:', {
      isAuthenticated: this.isAuthenticated,
      depot: this.depot,
      baseUrl: this.baseUrl,
      hasToken: !!this.authToken
    });
    return this.isAuthenticated;
  }

  /**
   * Get current depot
   */
  getCurrentDepot(): string {
    return this.depot;
  }

  /**
   * Switch to a different depot
   */
  switchDepot(depot: string): void {
    if (API_CONFIG.baseUrls[depot as keyof typeof API_CONFIG.baseUrls]) {
      this.depot = depot.toLowerCase();
      this.baseUrl = API_CONFIG.baseUrls[depot as keyof typeof API_CONFIG.baseUrls];
    }
  }

  /**
   * Clear authentication state
   */
  clearAuthentication(): void {
    this.isAuthenticated = false;
    this.authToken = '';
    this.depot = '';
    this.baseUrl = '';
    this.currentBaseUrl = '';
    console.log('Authentication cleared');
  }
}

// Global instance
export const qmsApi = new QMSApiClient();