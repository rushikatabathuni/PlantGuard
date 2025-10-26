// lib/mock-service.ts
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
console.log(API_URL)
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    indexes: null, // Disable array formatting
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('plantguard_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('plantguard_token')
      localStorage.removeItem('user')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const mockService = {
  async login(email: string, password: string) {
    try {
      // Extract username from email (before @)
      const username = email.includes('@') ? email.split('@')[0] : email
      
      console.log('Login params:', { username, password })
      
      const response = await apiClient.post('/auth/login', null, {
        params: new URLSearchParams({
          username: username,
          password: password
        })
      })
      
      return {
        user: {
          id: username,
          email: email,
          name: username,
          createdAt: new Date().toISOString(),
        },
        token: response.data.access_token,
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data)
      throw new Error(error.response?.data?.detail || 'Login failed')
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      const username = name.toLowerCase().replace(/\s+/g, '')
      
      const response = await apiClient.post('/auth/register', null, {
        params: new URLSearchParams({
          username: username,
          email: email,
          password: password
        })
      })
      
      // Auto-login after successful registration
      return await this.login(email, password)
    } catch (error: any) {
      console.error('Register error:', error.response?.data)
      
      if (error.response?.status === 400) {
        throw new Error('Username or email already exists. Please use different credentials.')
      }
      
      throw new Error(error.response?.data?.detail || 'Registration failed')
    }
  },

  async detectDisease(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await apiClient.post('/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      return {
        id: String(response.data.detection_id),
        disease: response.data.disease,
        confidence: response.data.confidence,
        recommendations: [response.data.advisory],
        createdAt: new Date().toISOString(),
      }
    } catch (error: any) {
      console.error('Detection error:', error.response?.data)
      throw new Error(error.response?.data?.detail || 'Detection failed')
    }
  },

  async getDetectionHistory(limit = 50) {
    try {
      const response = await apiClient.get('/history', {
        params: new URLSearchParams({
          skip: '0',
          limit: String(limit)
        })
      })
      
      return response.data.detections.map((d: any) => ({
        id: String(d.id),
        disease: d.disease,
        confidence: d.confidence,
        recommendations: [d.advisory],
        createdAt: d.timestamp,
        feedback: d.feedback === true ? true : d.feedback === false ? false : null
      }))
    } catch (error: any) {
      console.error('Failed to load history:', error.response?.data)
      return []
    }
  },

  async submitFeedback(detectionId: number, accurate: boolean) {
    try {
      const response = await apiClient.post('/feedback', null, {
        params: new URLSearchParams({
          detection_id: String(detectionId),
          accurate: String(accurate)
        })
      })
      
      return { success: true }
    } catch (error: any) {
      console.error('Feedback error:', error.response?.data)
      throw new Error(error.response?.data?.detail || 'Feedback submission failed')
    }
  },
  // Add these methods inside mockService object

async getAdminStats() {
  try {
    const response = await apiClient.get('/admin/stats')
    return response.data
  } catch (error: any) {
    console.error('Admin stats error:', error.response?.data)
    throw new Error(error.response?.data?.detail || 'Failed to load admin stats')
  }
},

async getAdminUsers() {
  try {
    const response = await apiClient.get('/admin/users')
    return response.data.users
  } catch (error: any) {
    console.error('Admin users error:', error.response?.data)
    throw new Error(error.response?.data?.detail || 'Failed to load users')
  }
},

async getAdminRecentDetections(limit = 20) {
  try {
    const response = await apiClient.get('/admin/recent-detections', {
      params: new URLSearchParams({ limit: String(limit) })
    })
    return response.data.detections
  } catch (error: any) {
    console.error('Admin detections error:', error.response?.data)
    throw new Error(error.response?.data?.detail || 'Failed to load detections')
  }
},


}

