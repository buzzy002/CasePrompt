import axios from 'axios'
import { useAuthStore } from '../stores/auth'

// 1. On utilise la variable d'environnement ou le fallback local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 2. Intercepteur : injecte automatiquement le token JWT s'il existe
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// 3. Envoi de l'action du joueur vers NestJS
export async function sendDetectiveAction(action: string) {
  const response = await apiClient.post('/api/investigation/action', { action })
  return response.data
}

export default apiClient