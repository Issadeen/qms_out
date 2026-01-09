/**
 * Mock QMS API Client for Demo/Development
 * Provides demo functionality without requiring access to actual KPC servers
 */

import { QMSApiResponse, LoginResponse, QueueItem, LoginCredentials } from './client';

// Mock queue data based on actual KPC QMS patterns
const MOCK_QUEUE_DATA: QueueItem[] = [
  {
    id: '1',
    queueNo: 1,
    code: 'AGO001',
    status: 'Safety',
    vehicleNumber: 'KCA 123A',
    driverName: 'John Kamau',
    companyName: 'Total Kenya Ltd',
    timestamp: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
  },
  {
    id: '2',
    queueNo: 2,
    code: 'PMS002',
    status: 'Dispatch',
    vehicleNumber: 'KAB 456B',
    driverName: 'Mary Wanjiku',
    companyName: 'Shell Kenya Ltd',
    timestamp: new Date().toISOString(),
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
  },
  {
    id: '3',
    queueNo: 3,
    code: 'IK003',
    status: 'Completed',
    vehicleNumber: 'KBA 789C',
    driverName: 'Peter Mwangi',
    companyName: 'Kenol Kobil',
    timestamp: new Date().toISOString(),
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: '4',
    queueNo: 4,
    code: 'AGO004',
    status: 'Safety',
    vehicleNumber: 'KCD 234D',
    driverName: 'Grace Njeri',
    companyName: 'Vivo Energy',
    timestamp: new Date().toISOString(),
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
  },
  {
    id: '5',
    queueNo: 5,
    code: 'PMS005',
    status: 'Dispatch',
    vehicleNumber: 'KAC 567E',
    driverName: 'Samuel Kiprop',
    companyName: 'Libya Oil Kenya',
    timestamp: new Date().toISOString(),
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
  }
];

// Valid demo credentials
const DEMO_CREDENTIALS = [
  { username: 'demo', password: 'demo123' },
  { username: 'kpc.user', password: 'password' },
  { username: 'admin', password: 'admin123' },
  { username: 'test', password: 'test123' },
];

export class MockQMSApiClient {
  private isAuthenticated: boolean = false;
  private depot: string = 'kisumu';
  private authToken?: string;

  /**
   * Mock login - accepts demo credentials
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Mock Login attempt: ${username}`);

    // Check demo credentials
    const validCredential = DEMO_CREDENTIALS.find(
      cred => cred.username === username && cred.password === password
    );

    if (validCredential) {
      this.isAuthenticated = true;
      this.authToken = 'mock-auth-token-' + Date.now();
      
      console.log('Mock login successful');
      return {
        success: true,
        data: {
          status: 0, // KPC API success status
          message: 'Login successful',
          user: username,
          depot: 'multi'
        },
        depot: 'multi'
      };
    } else {
      console.log('Mock login failed');
      return {
        success: false,
        error: 'Invalid username or password. Try: demo/demo123'
      };
    }
  }

  /**
   * Set working depot
   */
  setWorkingDepot(depot: string): void {
    this.depot = depot.toLowerCase();
    console.log(`Mock depot set to: ${depot}`);
  }

  /**
   * Get mock queue data
   */
  async getQueues(): Promise<QMSApiResponse<QueueItem[]>> {
    if (!this.isAuthenticated) {
      return {
        success: false,
        error: 'Not authenticated. Please login first.'
      };
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Add some randomness to simulate real-time updates
    const mockData = MOCK_QUEUE_DATA.map((item, index) => ({
      ...item,
      timestamp: new Date(Date.now() - (index * 5 * 60 * 1000)).toISOString(), // Stagger times
      updatedAt: new Date().toISOString()
    }));

    console.log(`Mock queue data for ${this.depot}:`, mockData);

    return {
      success: true,
      data: mockData
    };
  }

  /**
   * Get detailed queue data for a specific ID
   */
  async getDetailedQueues(broadqueueId: string): Promise<QMSApiResponse<any[]>> {
    if (!this.isAuthenticated) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find the queue item
    const queueItem = MOCK_QUEUE_DATA.find(item => item.id === broadqueueId);
    
    if (!queueItem) {
      return {
        success: false,
        error: 'Queue not found'
      };
    }

    // Return detailed mock data
    const detailedData = [
      {
        ...queueItem,
        details: {
          productType: queueItem.code.startsWith('AGO') ? 'Automotive Gas Oil' : 
                      queueItem.code.startsWith('PMS') ? 'Premium Motor Spirit' : 'Illuminating Kerosene',
          quantity: Math.floor(Math.random() * 50000) + 10000, // Random quantity 10k-60k liters
          loadingBay: Math.floor(Math.random() * 8) + 1, // Bay 1-8
          estimatedTime: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
          priority: queueItem.status === 'Safety' ? 'High' : 'Normal',
          depot: this.depot.charAt(0).toUpperCase() + this.depot.slice(1),
          driverContact: '+254 7' + Math.floor(Math.random() * 10000000).toString().padStart(8, '0'),
          vehicleCapacity: Math.floor(Math.random() * 20000) + 30000, // 30k-50k liters
        }
      }
    ];

    return {
      success: true,
      data: detailedData
    };
  }

  /**
   * Check authentication status
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Get current depot
   */
  getCurrentDepot(): string {
    return this.depot;
  }

  /**
   * Clear authentication
   */
  clearAuthentication(): void {
    this.isAuthenticated = false;
    this.authToken = undefined;
    console.log('Mock authentication cleared');
  }

  /**
   * Get queue details for a specific item
   */
  async getQueueDetails(id: string): Promise<QMSApiResponse<QueueItem>> {
    if (!this.isAuthenticated) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    const item = MOCK_QUEUE_DATA.find(q => q.id === id);
    if (!item) {
      return {
        success: false,
        error: 'Queue item not found'
      };
    }

    return {
      success: true,
      data: item
    };
  }
}

// Export singleton instance
export const mockQmsApi = new MockQMSApiClient();