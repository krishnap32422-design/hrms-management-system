 
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()

    try {
      const response = await axios.post(
        "http://https://hrms-management-system-147q.onrender.com/auth/login",
        {
          email: email,
          password: password
        }
      )

      console.log(response.data)

      // JWT token save
      localStorage.setItem(
        "token",
        response.data.access_token
      )

      // Dashboard par redirect
      navigate("/dashboard")

    } catch (error) {

      console.log(error)

      if (error.response) {
        alert(error.response.data.detail || "Login failed")
      } else {
        alert("Backend se connection nahi ho raha")
      }
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">
          <h1>HRMS</h1>

          <p>
            Human Resource Management System
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login