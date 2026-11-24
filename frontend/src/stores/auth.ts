import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref<boolean>(!!token.value)
  const user = ref<{ email: string } | null>(null)

  function setSession(newToken: string, email: string) {
    token.value = newToken
    isAuthenticated.value = true
    user.value = { email }
    localStorage.setItem('token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  function clearSession() {
    token.value = null
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  async function login(email: string, password: string) {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password })
    const receivedToken = res.data.access_token || res.data.token || res.data
    setSession(typeof receivedToken === 'string' ? receivedToken : receivedToken.token, email)
  }

  async function register(email: string, password: string) {
    await axios.post(`${API_URL}/auth/register`, { email, password })
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