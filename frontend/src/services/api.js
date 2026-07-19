import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  res => res,
  err => {
    let msg = 'Erro de conexao com o servidor.'

    if (err.response?.data) {
      if (typeof err.response.data === 'string') {
        msg = err.response.data
      } else if (err.response.data.erro) {
        msg = err.response.data.erro
      } else if (err.response.data.message) {
        msg = err.response.data.message
      } else {
        msg = JSON.stringify(err.response.data)
      }
    }

    return Promise.reject(new Error(msg))
  }
)

export default api
