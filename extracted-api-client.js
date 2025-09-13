/**
 * Extracted API Client from Ionic 3 App
 * Base patterns discovered from main.js bundle
 */

// API Endpoints discovered:
const API_CONFIG = {
  depots: ['eldoret', 'kisumu', 'nakuru'],
  baseUrls: {
    eldoret: 'https://qmseldoret.kpc.co.ke/',
    kisumu: 'https://qmskisumu.kpc.co.ke/', 
    nakuru: 'https://qmsnakuru.kpc.co.ke/',
    legacy: 'http://qms.kpc.co.ke:9090/' // fallback
  },
  endpoints: {
    login: 'apis/login',
    // Queue methods - need to be discovered from actual usage
    // Based on requestUrl(method) pattern, likely:
    // - handfield/broadqueue/{id} (from screens)
    // - apis/queue or similar
  }
};

// GlobalProvider equivalent
class QMSApiClient {
  constructor(depot = 'kisumu') {
    this.depot = depot.toLowerCase();
    this.baseUrl = API_CONFIG.baseUrls[this.depot];
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  requestUrl(method) {
    return `${this.baseUrl}${method}`;
  }

  async get(method, params = {}) {
    const url = new URL(this.requestUrl(method));
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers
    });
    return response.json();
  }

  async post(method, data = {}) {
    const response = await fetch(this.requestUrl(method), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async put(method, data = {}) {
    const response = await fetch(this.requestUrl(method), {
      method: 'PUT', 
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Login method from discovery
  async login(username, password) {
    const params = `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    
    // Try each depot in sequence (matches original fallback logic)
    const depots = ['kisumu', 'eldoret', 'nakuru'];
    
    for (const depot of depots) {
      try {
        const url = `${API_CONFIG.baseUrls[depot]}apis/login${params}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: this.headers
        });
        
        if (response.ok) {
          const data = await response.json();
          this.depot = depot;
          this.baseUrl = API_CONFIG.baseUrls[depot];
          return { success: true, data, depot };
        }
      } catch (error) {
        console.log(`Failed to login to ${depot}:`, error);
        continue;
      }
    }
    
    return { success: false, error: 'All depots failed' };
  }

  // Queue methods (to be implemented based on actual API discovery)
  async getQueues() {
    // Placeholder - need to find actual endpoint
    return this.get('handheld/broadqueue'); // guess based on patterns
  }

  async getQueueDetails(id) {
    return this.get(`handheld/broadqueue/${id}`);
  }
}

export { QMSApiClient, API_CONFIG };