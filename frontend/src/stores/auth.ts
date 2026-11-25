import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<{ email: string } | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  const isAuthenticated = computed(() => !!token.value)

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