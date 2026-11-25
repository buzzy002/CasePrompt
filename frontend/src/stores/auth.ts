import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../services/api'


// Lecture sécurisée : une valeur corrompue ne doit pas faire planter l'app
  function readStoredUser(): { email: string } | null {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  }
// Lecture sécurisée : une valeur corrompue ne doit pas faire planter l'app
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<{ email: string } | null>(readStoredUser())

  
//L'ordinateur peut stocker des données corrompues dans le localStorage, donc on doit vérifier que la valeur est bien un objet avec une propriété email de type string
  const isAuthenticated = computed(() => !!token.value)


// Fonction pour mettre à jour le token et l'utilisateur dans le store et le localStorage
  function setSession(newToken: string, email: string) {
    token.value = newToken
    user.value = { email }
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify({ email }))
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function login(email: string, password: string) {
    const res = await apiClient.post('/auth/login', { email, password })
    const receivedToken = res.data?.access_token || res.data?.token || (typeof res.data === 'string' ? res.data : null)
    
    if (!receivedToken) {
      throw new Error('Réponse d\'authentification invalide du serveur.')
    }
    
    setSession(receivedToken, email)
  }

  async function register(email: string, password: string) {
    await apiClient.post('/auth/register', { email, password })
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    clearSession
  }
})