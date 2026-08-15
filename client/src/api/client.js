import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})


// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


// Handle API errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {

    if (error.code === "ECONNABORTED") {
      console.error("Request timeout")
    }

    if (error.response) {
      console.error(
        "API Error:",
        error.response.data
      )
    } else {
      console.error(
        "Network Error:",
        error.message
      )
    }

    return Promise.reject(error)
  }
)


export default api