import axios from 'axios'

export const apiGo = axios.create({
  baseURL: import.meta.env.VITE_API_GO_URL,
  timeout: 15000,
})

export const apiDjango = axios.create({
  baseURL: import.meta.env.VITE_API_DJANGO_URL,
  timeout: 15000,
})

export const apiFastAPI = axios.create({
  baseURL: import.meta.env.VITE_API_FASTAPI_URL,
  timeout: 15000,
})
