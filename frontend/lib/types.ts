export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface DetectionResult {
  id: string
  imageUrl: string
  disease: string
  confidence: number
  recommendations: string[]
  createdAt: string
  feedback?: boolean | null  // Was: "helpful" | "not-helpful" | null
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

export interface DetectionResponse {
  disease: string
  confidence: number
  recommendations: string[]
}
