// API service for handling backend communication
import { auth } from '../config/firebase';
import { getIdToken } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get Firebase auth token
  async getAuthToken() {
    if (auth.currentUser) {
      try {
        return await getIdToken(auth.currentUser);
      } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
      }
    }
    return null;
  }

  // Generic HTTP methods
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add Firebase auth token if available
    const token = await this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication endpoints
  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async signup(name, email, password) {
    return this.post('/auth/signup', { name, email, password });
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async refreshToken() {
    return this.post('/auth/refresh');
  }

  // User endpoints
  async getUserProfile() {
    return this.get('/user/profile');
  }

  async updateUserProfile(userData) {
    return this.put('/user/profile', userData);
  }

  async deleteUserAccount() {
    return this.delete('/user/account');
  }

  // Assessment endpoints
  async submitAssessment(assessmentData) {
    return this.post('/assessments', assessmentData);
  }

  async getUserAssessments() {
    return this.get('/assessments/user');
  }

  async getAssessmentById(id) {
    return this.get(`/assessments/${id}`);
  }

  // Resources endpoints
  async getResources(category = null, search = null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const queryString = params.toString();
    return this.get(`/resources${queryString ? `?${queryString}` : ''}`);
  }

  async getResourceById(id) {
    return this.get(`/resources/${id}`);
  }

  async saveResource(resourceId) {
    return this.post(`/resources/${resourceId}/save`);
  }

  async unsaveResource(resourceId) {
    return this.delete(`/resources/${resourceId}/save`);
  }

  async getSavedResources() {
    return this.get('/resources/saved');
  }

  // Mood tracking endpoints
  async logMood(moodData) {
    return this.post('/mood', moodData);
  }

  async getMoodHistory(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    
    const queryString = params.toString();
    return this.get(`/mood${queryString ? `?${queryString}` : ''}`);
  }

  // Analytics endpoints
  async getUserAnalytics() {
    return this.get('/analytics/user');
  }

  async getDashboardData() {
    return this.get('/dashboard');
  }

  // Emergency endpoints
  async getEmergencyResources() {
    return this.get('/emergency/resources');
  }

  async requestEmergencyHelp(location) {
    return this.post('/emergency/help', { location });
  }

  // Crisis Detection endpoints
  async analyzeCrisisContent(content, contentType = 'text') {
    return this.post('/crisis/analyze', { content, type: contentType });
  }

  async getCrisisAlerts(userId) {
    return this.get(`/crisis/alerts/${userId}`);
  }

  async getCrisisResources() {
    return this.get('/resources/crisis');
  }

  async addEmergencyContact(contactData) {
    return this.post('/emergency/contacts', contactData);
  }

  async getEmergencyContacts() {
    return this.get('/emergency/contacts');
  }

  async removeEmergencyContact(contactId) {
    return this.delete(`/emergency/contacts/${contactId}`);
  }

  // Real-time crisis monitoring
  async subscribeToAlerts(callback) {
    // This would implement WebSocket connection for real-time alerts
    // For now, we'll use polling
    const pollForAlerts = async () => {
      try {
        const alerts = await this.getCrisisAlerts('current_user');
        if (alerts && alerts.length > 0) {
          callback(alerts);
        }
      } catch (error) {
        console.error('Error polling for alerts:', error);
      }
    };

    // Poll every 30 seconds
    const intervalId = setInterval(pollForAlerts, 30000);
    
    // Return unsubscribe function
    return () => clearInterval(intervalId);
  }

  // Crisis intervention actions
  async triggerSafetyPlan(userId) {
    return this.post('/crisis/safety-plan', { userId });
  }

  async logInterventionAction(actionData) {
    return this.post('/crisis/intervention', actionData);
  }

  // Analytics and reporting
  async getCrisisAnalytics(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    
    const queryString = params.toString();
    return this.get(`/crisis/analytics${queryString ? `?${queryString}` : ''}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
