import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref<boolean>(!!token.value)
  const user = ref<{ email: string } | null>(null)

  function setSession(newToken: string, email: string) {
    token.value = newToken
    isAuthenticated.value = true
    user.value = { email }
    localStorage.setItem('token', newToken)
  }

  function clearSession() {
    token.value = null
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('token')
  }

  async function login(email: string, password: string) {
    const res = await apiClient.post('/auth/login', { email, password })
    const receivedToken = res.data.access_token || res.data.token || res.data
    setSession(typeof receivedToken === 'string' ? receivedToken : receivedToken.token, email)
  }

  async function register(email: string, password: string) {
    await apiClient.post('/auth/register', { email, password })
  }

  return {
    token,
    isAuthenticated,
    user,
    login,
    register,
    clearSession
  }
})