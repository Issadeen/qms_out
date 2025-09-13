import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private static instance: CacheManager;

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async set<T>(key: string, data: T, expiresInMs: number = 5 * 60 * 1000): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInMs,
    };

    try {
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - cacheItem.timestamp > cacheItem.expiresIn) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('Cache remove error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  // Generate cache key for API endpoints
  getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `api_${endpoint}_${paramString}`;
  }
}

export default CacheManager.getInstance();