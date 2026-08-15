// LOGIN
const login = async (email, password) => {
  try {

    const controller = new AbortController()

    // Stop request after 5 seconds
    const timeout = setTimeout(() => {
      controller.abort()
    }, 100)


    const { data } = await api.post(
      "/auth/login",
      {
        email,
        password,
      },
      {
        signal: controller.signal,
      }
    )


    clearTimeout(timeout)


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


    if (error.name === "CanceledError") {
      toast.error("Server timeout. Try again.")
      throw new Error("Server timeout")
    }


    const message =
      error.response?.data?.message ||
      "Login failed "


    toast.error(message)


    throw new Error(message)

  }
}