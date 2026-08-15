import { createContext, useContext, useState, useEffect } from "react"
import api from "../api/client"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  )
  const [loading, setLoading] = useState(true)


  // Load logged-in user
  useEffect(() => {

    const loadUser = async () => {

      if (token) {

        try {

          const { data } = await api.get("/auth/me")

          setUser(data.user)

        } catch (error) {

          console.error(
            "Load user error:",
            error.response?.data || error.message
          )

          logout()

        }

      }

      setLoading(false)

    }


    loadUser()

  }, [token])


  // LOGIN
  const login = async (email, password) => {

    try {

      const { data } = await api.post("/auth/login", {
        email,
        password,
      })


      localStorage.setItem(
        "token",
        data.token
      )


      setToken(data.token)

      setUser(data.user)


      toast.success(
        data.message || "Login successful"
      )


      return data


    } catch (error) {


      const message =
        error.response?.data?.message ||
        "Login failed"


      toast.error(message)


      throw new Error(message)

    }

  }



  // REGISTER
  const register = async (userData) => {

    try {

      const { data } = await api.post(
        "/auth/register",
        userData
      )


      localStorage.setItem(
        "token",
        data.token
      )


      setToken(data.token)

      setUser(data.user)


      toast.success(
        data.message || "Registration successful"
      )


      return data


    } catch (error) {


      const message =
        error.response?.data?.message ||
        "Registration failed"


      toast.error(message)


      throw new Error(message)

    }

  }



  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token")

    setToken(null)

    setUser(null)


    toast.success(
      "Logout successful"
    )

  }



  // UPDATE USER
  const updateUser = (updatedUser) => {

    setUser(updatedUser)

  }



  return (

    <AuthContext.Provider

      value={{

        user,

        token,

        loading,

        isAuthenticated: !!user,

        isAdmin: user?.role === "admin",


        login,

        register,

        logout,

        updateUser,

      }}

    >

      {children}

    </AuthContext.Provider>

  )

}