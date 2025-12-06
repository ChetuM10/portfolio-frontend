"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../lib/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const res = await api.get("/auth/me")
        setUser(res.data.data)
      } catch (error) {
        localStorage.removeItem("token")
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password })
    localStorage.setItem("token", res.data.data.token)
    setUser(res.data.data)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password })
    localStorage.setItem("token", res.data.data.token)
    setUser(res.data.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
