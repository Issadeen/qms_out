import CacheManager from './cache';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface RequestConfig {
  useCache?: boolean;
  cacheExpiry?: number; // milliseconds
  retries?: number;
  timeout?: number;
}

class OptimizedApiClient {
  private static instance: OptimizedApiClient;
  private baseUrl: string = '';

  public static getInstance(): OptimizedApiClient {
    if (!OptimizedApiClient.instance) {
      OptimizedApiClient.instance = new OptimizedApiClient();
    }
    return OptimizedApiClient.instance;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      useCache = true,
      cacheExpiry = 5 * 60 * 1000, // 5 minutes default
      retries = 3,
      timeout = 10000
    } = config;

    // Check cache first
    if (useCache && options.method !== 'POST') {
      const cacheKey = CacheManager.getCacheKey(endpoint, options.body ? JSON.parse(options.body as string) : undefined);
      const cachedData = await CacheManager.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    let lastError: Error;

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful GET requests
        if (useCache && options.method !== 'POST') {
          const cacheKey = CacheManager.getCacheKey(endpoint, options.body ? JSON.parse(options.body as string) : undefined);
          await CacheManager.set(cacheKey, data, cacheExpiry);
        }

        return data;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on abort (timeout) or for the last attempt
        if (error instanceof Error && error.name === 'AbortError' || attempt === retries) {
          break;
        }

        // Exponential backoff
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    clearTimeout(timeoutId);
    throw lastError!;
  }

  // Optimized methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' }, config);
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      { ...config, useCache: false } // Don't cache POST requests
    );
  }

  // Batch requests for better performance
  async batchGet<T>(endpoints: string[], config?: RequestConfig): Promise<T[]> {
    const promises = endpoints.map(endpoint => this.get<T>(endpoint, config));
    return Promise.all(promises);
  }

  // Preload data for faster access
  async preloadData(endpoints: string[], config?: RequestConfig): Promise<void> {
    // Fire and forget - load data into cache
    endpoints.forEach(endpoint => {
      this.get(endpoint, config).catch(() => {
        // Ignore errors for preloading
      });
    });
  }

  // Clear cache for specific endpoint
  async invalidateCache(endpoint: string, params?: any): Promise<void> {
    const cacheKey = CacheManager.getCacheKey(endpoint, params);
    await CacheManager.remove(cacheKey);
  }

  // Clear all cache
  async clearAllCache(): Promise<void> {
    await CacheManager.clear();
  }
}

export default OptimizedApiClient.getInstance();