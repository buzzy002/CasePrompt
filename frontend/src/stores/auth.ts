import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../services/api'

type StoredUser = { email: string }

// Lecture sécurisée : une valeur corrompue ne doit pas faire planter l'app
function readStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

// Vérifie l'expiration d'un JWT (un token opaque est laissé au serveur)
function isTokenExpired(token: string): boolean {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(base64))
    return typeof exp === 'number' && exp * 1000 < Date.now()
  } catch {
    return false
  }
}

export const useAuthStore = defineStore('auth', () => {
  const stored = localStorage.getItem('token')
  const validToken = stored && !isTokenExpired(stored) ? stored : null
  if (!validToken) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const token = ref<string | null>(validToken)
  const user = ref<StoredUser | null>(validToken ? readStoredUser() : null)
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
    const receivedToken =
      res.data?.access_token || res.data?.token || (typeof res.data === 'string' ? res.data : null)

    if (!receivedToken) {
      throw new Error("Réponse d'authentification invalide du serveur.")
    }
    setSession(receivedToken, email)
  }

  async function register(email: string, password: string) {
    await apiClient.post('/auth/register', { email, password })
  }

  return { token, user, isAuthenticated, login, register, clearSession }
})