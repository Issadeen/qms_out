/**
 * QMS API Client for React Native
 * Based on the original Ionic 3 app endpoints and patterns
 * Supports both real API and demo mode
 */

import APP_CONFIG from '../config/appConfig';
import { mockQmsApi } from './mockClient';

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
  
  // Web authentication properties
  private isWebAuthenticated: boolean = false;
  private webSessionCookies?: string;
  private csrfToken?: string;

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
      console.log(`Attempting to connect to: ${url}`);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'User-Agent': 'KPC-QMS-Mobile/1.0',
          'Cache-Control': 'no-cache',
          ...options.headers,
        },
        mode: 'cors', // Enable CORS
        credentials: 'omit', // Don't send credentials for cross-origin
      });
      clearTimeout(timeoutId);
      console.log(`Response from ${url}: ${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Connection error to ${url}:`, error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Connection timeout to KPC server (${timeout}ms)`);
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to reach KPC servers. Please check:\n• Internet connection\n• VPN connection to KPC network\n• Network firewall settings');
        }
      }
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
    
    console.log('Starting multi-depot login process...');
    
    for (const depot of depots) {
      try {
        console.log(`Attempting login to ${depot}...`);
        const baseUrl = API_CONFIG.baseUrls[depot as keyof typeof API_CONFIG.baseUrls];
        
        // Use POST with form data like the original Ionic app
        const formData = new URLSearchParams();
        formData.append('username', username.trim());
        formData.append('password', password.trim());
        
        const url = `${baseUrl}apis/login`;

        const response = await this.fetchWithTimeout(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        if (response.ok) {
          const data = await response.json();
          
          console.log(`Response from ${depot}:`, data);
          
          // Match original Ionic app: status !== 1 means success
          if (data.status !== 1) {
            // Set authenticated but don't set specific depot yet
            this.isAuthenticated = true;
            this.authToken = data.token || 'authenticated';
          
            console.log(`Login successful to ${depot}`, data);
            return {
              success: true,
              data,
              depot: 'multi', // Indicate multi-depot login success
            };
          } else {
            console.log(`Login failed to ${depot}: status = ${data.status}, message = ${data.message || 'No message'}`);
            continue; // Try next depot
          }
        } else {
          console.log(`Login failed to ${depot}: HTTP ${response.status} - ${response.statusText}`);
          
          // Try to read error response
          try {
            const errorText = await response.text();
            console.log(`Error response from ${depot}:`, errorText);
          } catch (e) {
            console.log(`Could not read error response from ${depot}`);
          }
        }
      } catch (error) {
        console.log(`Login error to ${depot}:`, error);
        if (error instanceof Error && error.message.includes('Unable to reach KPC servers')) {
          // If it's a connection error, don't try other depots - they'll likely fail too
          return {
            success: false,
            error: error.message
          };
        }
        continue;
      }
    }

    return {
      success: false,
      error: 'Login failed on all KPC depots. Please check your credentials and network connection.',
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
   * Get CSRF token from the login page for web authentication
   */
  private async getCSRFToken(): Promise<string | null> {
    try {
      const loginPageUrl = `${this.baseUrl}login`;
      console.log(`Fetching CSRF token from: ${loginPageUrl}`);
      
      const response = await fetch(loginPageUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to fetch login page for CSRF token');
        return null;
      }

      const html = await response.text();
      
      // Extract CSRF token from meta tag or hidden input
      const csrfMatch = html.match(/name="csrf-token"[^>]*content="([^"]+)"/i) || 
                       html.match(/name="_token"[^>]*value="([^"]+)"/i) ||
                       html.match(/_token[^>]*value="([^"]+)"/i);
      
      if (csrfMatch && csrfMatch[1]) {
        console.log('CSRF token extracted successfully');
        return csrfMatch[1];
      }

      console.error('Could not extract CSRF token from login page');
      return null;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    }
  }

  /**
   * Web-based login using CSRF token and form authentication
   * This method is for accessing web-specific endpoints like get_home
   */
  async loginWeb(email: string, password: string, depot: string = 'eldoret'): Promise<LoginResponse> {
    try {
      console.log(`Starting web authentication for ${depot}...`);
      
      // Set the depot for web login
      this.setWorkingDepot(depot);
      
      // Step 1: Get CSRF token
      const csrfToken = await this.getCSRFToken();
      if (!csrfToken) {
        return {
          success: false,
          error: 'Failed to obtain CSRF token for web login',
        };
      }

      this.csrfToken = csrfToken;

      // Step 2: Perform login with form data
      const loginUrl = `${this.baseUrl}login`;
      const formData = new URLSearchParams();
      formData.append('_token', csrfToken);
      formData.append('email', email.trim());
      formData.append('password', password.trim());

      console.log(`Attempting web login to: ${loginUrl}`);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': `${this.baseUrl}login`,
        },
        body: formData.toString(),
        credentials: 'include',
        redirect: 'manual', // Don't auto-follow redirects
      });

      console.log(`Web login response: ${response.status} ${response.statusText}`);

      // Check if login was successful (typically 302 redirect on success)
      if (response.status === 302 || response.status === 200) {
        // Extract session cookies
        const cookies = response.headers.get('set-cookie');
        if (cookies) {
          this.webSessionCookies = cookies;
          this.isWebAuthenticated = true;
          
          console.log('Web authentication successful');
          return {
            success: true,
            depot: depot,
          };
        }
      }

      // Check response body for error messages
      const responseText = await response.text();
      console.log('Web login response body:', responseText.substring(0, 500));

      return {
        success: false,
        error: 'Web login failed. Please check your email and password.',
      };

    } catch (error) {
      console.error('Web login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Web login failed',
      };
    }
  }

  /**
   * Check if user has web authentication (for get_home endpoint)
   */
  isWebAuthenticatedUser(): boolean {
    return this.isWebAuthenticated && !!this.webSessionCookies;
  }

  /**
   * Clear web authentication
   */
  clearWebAuthentication(): void {
    this.isWebAuthenticated = false;
    this.webSessionCookies = undefined;
    this.csrfToken = undefined;
    console.log('Web authentication cleared');
  }

  /**
   * Login using shared account for users without web access
   * This is transparent to the user - they don't see the credentials
   */
  async loginWithSharedAccount(depot: string = 'eldoret'): Promise<LoginResponse> {
    try {
      console.log('🔗 Using shared account for historical data access...');
      
      // Use the shared credentials transparently
      const sharedCredentials = {
        email: 'charles.momanyi',
        password: '1972'
      };

      const result = await this.loginWeb(sharedCredentials.email, sharedCredentials.password, depot);
      
      if (result.success) {
        console.log('✅ Shared account authentication successful');
      } else {
        console.log('❌ Shared account authentication failed:', result.error);
      }

      return result;
    } catch (error) {
      console.error('Shared account login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Shared account login failed',
      };
    }
  }

  /**
   * Get paginated historical queues from the get_home endpoint with date filtering
   * Falls back to handheld/broadqueues with mock pagination if get_home is not available
   * @param date - Date in YYYY-MM-DD format (defaults to today)
   * @param page - Page number for pagination (defaults to 1)
   */
  async getHomeQueues(date?: string, page: number = 1): Promise<QMSApiResponse<{
    export_queues: any[],
    local_queues: any[],
    export_pagination: {
      current_page: number,
      last_page: number,
      next_page_url: string | null,
      prev_page_url: string | null,
      per_page: number,
      total: number
    },
    local_pagination: {
      current_page: number,
      last_page: number,
      next_page_url: string | null,
      prev_page_url: string | null,
      per_page: number,
      total: number
    }
  }>> {
    console.log('🏠 getHomeQueues called, checking authentication...');
    console.log('🔑 isAuthenticated:', this.isAuthenticated);
    console.log('🌐 isWebAuthenticated:', this.isWebAuthenticated);
    
    if (!this.isAuthenticated) {
      console.log('❌ Not authenticated, cannot fetch queue data');
      return {
        success: false,
        error: 'Not authenticated. Please login first.',
      };
    }

    const params: Record<string, string> = {
      page: page.toString(),
    };
    
    if (date) {
      params.date = date;
    }

    console.log(`📊 Fetching paginated queue data from ${this.depot} depot`, params);
    
    // Try get_home endpoint first
    const endpoint = 'get_home';
    const url = `${this.baseUrl}${endpoint}`;
    const queryParams = new URLSearchParams(params).toString();
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;

    try {
      // Use web authentication headers if available, otherwise fall back to API auth
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      if (this.isWebAuthenticated && this.webSessionCookies) {
        console.log('Using web authentication for get_home endpoint');
        headers['Cookie'] = this.webSessionCookies;
        headers['X-CSRF-TOKEN'] = this.csrfToken || '';
        headers['X-Requested-With'] = 'XMLHttpRequest';
      } else if (this.authToken) {
        console.log('Using API authentication for get_home endpoint');
        headers['Authorization'] = `Bearer ${this.authToken}`;
        headers['Content-Type'] = 'application/json';
      } else {
        console.log('No authentication available, falling back to regular queues');
        return this.fallbackToRegularQueues(page);
      }

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
        credentials: this.isWebAuthenticated ? 'include' : 'omit',
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON response, falling back:', text);
        // Fall back to handheld/broadqueues
        return this.fallbackToRegularQueues(page);
      }

      console.log('Response from get_home:', data);

      if (response.ok && data && !data.message?.includes('Unauthenticated')) {
        // Extract the paginated queue data from the API response
        console.log('Processing web API response with broadqueues structure');
        
        const result = {
          export_queues: data.export_broadqueues?.data || [],
          local_queues: data.local_broadqueues?.data || [],
          export_pagination: {
            current_page: data.export_broadqueues?.current_page || 1,
            last_page: data.export_broadqueues?.last_page || 1,
            next_page_url: data.export_broadqueues?.next_page_url || null,
            prev_page_url: data.export_broadqueues?.prev_page_url || null,
            per_page: data.export_broadqueues?.per_page || 15,
            total: data.export_broadqueues?.total || 0
          },
          local_pagination: {
            current_page: data.local_broadqueues?.current_page || 1,
            last_page: data.local_broadqueues?.last_page || 1,
            next_page_url: data.local_broadqueues?.next_page_url || null,
            prev_page_url: data.local_broadqueues?.prev_page_url || null,
            per_page: data.local_broadqueues?.per_page || 15,
            total: data.local_broadqueues?.total || 0
          }
        };

        // Transform broadqueues to have the properties our UI expects
        result.export_queues = result.export_queues.map((broadqueue: any) => ({
          ...broadqueue,
          order_type: 'Export',
          criteria: `Criteria ${broadqueue.criteria_id}`,
          products: broadqueue.product?.description || 'Mixed Products',
          order_count: broadqueue.orders?.length || 0,
          order_date_formatted: new Date(broadqueue.order_date).toLocaleDateString(),
          // Include original structure for detailed view
          orders: broadqueue.orders || [],
          product: broadqueue.product
        }));

        result.local_queues = result.local_queues.map((broadqueue: any) => ({
          ...broadqueue,
          order_type: 'Local',
          criteria: `Criteria ${broadqueue.criteria_id}`,
          products: broadqueue.product?.description || 'Mixed Products',
          order_count: broadqueue.orders?.length || 0,
          order_date_formatted: new Date(broadqueue.order_date).toLocaleDateString(),
          // Include original structure for detailed view
          orders: broadqueue.orders || [],
          product: broadqueue.product
        }));

        console.log(`Processed ${result.export_queues.length} export broadqueues and ${result.local_queues.length} local broadqueues`);
        return { success: true, data: result };
      } else {
        console.log('get_home endpoint not available or unauthenticated, falling back to handheld/broadqueues');
        return this.fallbackToRegularQueues(page);
      }
    } catch (error) {
      console.error('Failed to fetch from get_home, falling back:', error);
      return this.fallbackToRegularQueues(page);
    }
  }

  /**
   * Fallback method to use handheld/broadqueues with mock pagination
   */
  private async fallbackToRegularQueues(page: number = 1): Promise<QMSApiResponse<{
    export_queues: any[],
    local_queues: any[],
    export_pagination: {
      current_page: number,
      last_page: number,
      next_page_url: string | null,
      prev_page_url: string | null,
      per_page: number,
      total: number
    },
    local_pagination: {
      current_page: number,
      last_page: number,
      next_page_url: string | null,
      prev_page_url: string | null,
      per_page: number,
      total: number
    }
  }>> {
    console.log('Using fallback method with handheld/broadqueues');
    
    // Use the existing getQueues method to get current data
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
      
      console.log('Fallback response from handheld/broadqueues:', data);
      
      if (response.ok) {
        let allQueues = [];
        if (data && data.content && Array.isArray(data.content)) {
          allQueues = data.content;
        } else if (Array.isArray(data)) {
          allQueues = data;
        } else if (data && typeof data === 'object' && data.message === '') {
          allQueues = [];
        } else {
          allQueues = [];
        }

        // Filter by order type and create mock pagination
        const exportQueues = allQueues.filter((item: any) => item.order_type === 'Export');
        const localQueues = allQueues.filter((item: any) => item.order_type === 'Local');
        
        // Create mock pagination (simulate having multiple pages for demo)
        const perPage = 10;
        const exportTotal = exportQueues.length;
        const localTotal = localQueues.length;
        
        const exportLastPage = Math.max(1, Math.ceil(exportTotal / perPage));
        const localLastPage = Math.max(1, Math.ceil(localTotal / perPage));
        
        // Paginate the results
        const exportStart = (page - 1) * perPage;
        const localStart = (page - 1) * perPage;
        
        const paginatedExportQueues = exportQueues.slice(exportStart, exportStart + perPage);
        const paginatedLocalQueues = localQueues.slice(localStart, localStart + perPage);

        const result = {
          export_queues: paginatedExportQueues,
          local_queues: paginatedLocalQueues,
          export_pagination: {
            current_page: page,
            last_page: exportLastPage,
            next_page_url: page < exportLastPage ? `${url}?page=${page + 1}` : null,
            prev_page_url: page > 1 ? `${url}?page=${page - 1}` : null,
            per_page: perPage,
            total: exportTotal
          },
          local_pagination: {
            current_page: page,
            last_page: localLastPage,
            next_page_url: page < localLastPage ? `${url}?page=${page + 1}` : null,
            prev_page_url: page > 1 ? `${url}?page=${page - 1}` : null,
            per_page: perPage,
            total: localTotal
          }
        };

        return { success: true, data: result };
      } else {
        return {
          success: false,
          error: `Queue API error: HTTP ${response.status}`,
        };
      }
    } catch (error) {
      console.error('Failed to fetch fallback queue data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
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

// Global instance with demo mode support
class QMSApiManager {
  private realApi: QMSApiClient;
  
  constructor() {
    this.realApi = new QMSApiClient();
  }
  
  // Delegate methods to appropriate client based on demo mode
  async login(username: string, password: string): Promise<LoginResponse> {
    if (APP_CONFIG.DEMO_MODE) {
      console.log('Using demo mode for login');
      return mockQmsApi.login(username, password);
    } else {
      console.log('Using real API for login');
      return this.realApi.login(username, password);
    }
  }
  
  setWorkingDepot(depot: string): void {
    if (APP_CONFIG.DEMO_MODE) {
      mockQmsApi.setWorkingDepot(depot);
    } else {
      this.realApi.setWorkingDepot(depot);
    }
  }
  
  async getQueues(): Promise<QMSApiResponse<QueueItem[]>> {
    if (APP_CONFIG.DEMO_MODE) {
      return mockQmsApi.getQueues();
    } else {
      return this.realApi.getQueues();
    }
  }
  
  async getHomeQueues(date?: string, page: number = 1): Promise<QMSApiResponse<{
    export_queues: any[],
    local_queues: any[],
    export_pagination: {
      current_page: number,
      last_page: number,
      next_page_url: string | null,
      prev_page_url: string | null,
      per_page: number,
      total: number
    },
    local_pagination: {
      current_page: number,
      last_page: number,
      next_page_url: string | null,
      prev_page_url: string | null,
      per_page: number,
      total: number
    }
  }>> {
    if (APP_CONFIG.DEMO_MODE) {
      // For demo mode, we'll simulate paginated data based on the regular getQueues
      const queuesResponse = await mockQmsApi.getQueues();
      if (queuesResponse.success && queuesResponse.data) {
        // In demo mode, create mock export and local queues
        const exportQueues = queuesResponse.data.map((item: any) => ({ ...item, order_type: 'Export' }));
        const localQueues = queuesResponse.data.map((item: any) => ({ ...item, order_type: 'Local' }));
        
        return {
          success: true,
          data: {
            export_queues: exportQueues,
            local_queues: localQueues,
            export_pagination: {
              current_page: 1,
              last_page: 1,
              next_page_url: null,
              prev_page_url: null,
              per_page: 15,
              total: exportQueues.length
            },
            local_pagination: {
              current_page: 1,
              last_page: 1,
              next_page_url: null,
              prev_page_url: null,
              per_page: 15,
              total: localQueues.length
            }
          }
        };
      } else {
        return {
          success: false,
          error: queuesResponse.error || 'Failed to load demo data'
        };
      }
    } else {
      return this.realApi.getHomeQueues(date, page);
    }
  }
  
  async getDetailedQueues(broadqueueId: string): Promise<QMSApiResponse<any[]>> {
    if (APP_CONFIG.DEMO_MODE) {
      return mockQmsApi.getDetailedQueues(broadqueueId);
    } else {
      return this.realApi.getDetailedQueues(broadqueueId);
    }
  }
  
  async getQueueDetails(id: string): Promise<QMSApiResponse<QueueItem>> {
    if (APP_CONFIG.DEMO_MODE) {
      return mockQmsApi.getQueueDetails(id);
    } else {
      return this.realApi.getQueueDetails(id);
    }
  }
  
  isUserAuthenticated(): boolean {
    if (APP_CONFIG.DEMO_MODE) {
      return mockQmsApi.isUserAuthenticated();
    } else {
      return this.realApi.isUserAuthenticated();
    }
  }
  
  getCurrentDepot(): string {
    if (APP_CONFIG.DEMO_MODE) {
      return mockQmsApi.getCurrentDepot();
    } else {
      return this.realApi.getCurrentDepot();
    }
  }
  
  clearAuthentication(): void {
    if (APP_CONFIG.DEMO_MODE) {
      mockQmsApi.clearAuthentication();
    } else {
      this.realApi.clearAuthentication();
    }
  }
  
  // Real API specific methods
  async loginToSpecificDepot(username: string, password: string, depot: string): Promise<LoginResponse> {
    if (APP_CONFIG.DEMO_MODE) {
      // Redirect to regular mock login
      return mockQmsApi.login(username, password);
    } else {
      return this.realApi.loginToSpecificDepot(username, password, depot);
    }
  }
  
  switchDepot(depot: string): void {
    if (!APP_CONFIG.DEMO_MODE) {
      this.realApi.switchDepot(depot);
    }
  }

  // Web authentication methods
  async loginWeb(email: string, password: string, depot: string = 'eldoret'): Promise<LoginResponse> {
    if (APP_CONFIG.DEMO_MODE) {
      console.log('Web login not available in demo mode');
      return {
        success: false,
        error: 'Web login not available in demo mode',
      };
    } else {
      return this.realApi.loginWeb(email, password, depot);
    }
  }

  isWebAuthenticated(): boolean {
    if (APP_CONFIG.DEMO_MODE) {
      return false;
    } else {
      return this.realApi.isWebAuthenticatedUser();
    }
  }

  clearWebAuthentication(): void {
    if (!APP_CONFIG.DEMO_MODE) {
      this.realApi.clearWebAuthentication();
    }
  }

  async loginWithSharedAccount(depot: string = 'eldoret'): Promise<LoginResponse> {
    if (APP_CONFIG.DEMO_MODE) {
      console.log('Shared account login not available in demo mode');
      return {
        success: false,
        error: 'Shared account login not available in demo mode',
      };
    } else {
      return this.realApi.loginWithSharedAccount(depot);
    }
  }
}

export const qmsApi = new QMSApiManager();