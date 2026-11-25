import axios from 'axios'
import { useAuthStore } from '../stores/auth'

// 1. Base URL dynamique via variable d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 2. Intercepteur Requête : injecte le Bearer Token JWT
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// 3. Intercepteur Réponse : déconnexion automatique sur 401 (sauf sur les routes /auth/*)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth/')

    if (error.response?.status === 401 && !isAuthRoute) {
      const authStore = useAuthStore()
      authStore.clearSession()
      window.location.href = '/connexion'
    }
    return Promise.reject(error)
  }
)

// 4. Envoi de l'action du joueur vers le central IA
export async function sendDetectiveAction(action: string) {
  const response = await apiClient.post('/api/investigation/action', { action })
  return response.data
}

export default apiClient