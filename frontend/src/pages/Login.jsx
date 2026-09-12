import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = "https://hrms-management-system-147q.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    try {
      // Remove any old Demo or previous login token
      localStorage.removeItem("token");

      const response = await axios.post(
        `${API}/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      // Save the real user's token
      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.detail ||
          "Login failed"
        );
      } else {
        alert(
          "Backend se connection nahi ho raha"
        );
      }
    }
  }

  async function handleDemoLogin() {
    try {
      // Remove any old user token
      localStorage.removeItem("token");

      // IMPORTANT: Demo has its own endpoint
      const response = await axios.post(
        `${API}/auth/demo-login`
      );

      // Save Demo token
      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.detail ||
          "Demo login failed"
        );
      } else {
        alert(
          "Backend se connection nahi ho raha"
        );
      }
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">
          <h1>HRMS</h1>
          <p>Human Resource Management System</p>
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
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <div className="demo-login-section">

          <div className="demo-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="demo-login-button"
            onClick={handleDemoLogin}
          >
            🚀 Try Demo
          </button>

          <p className="demo-login-text">
            Explore the HRMS with read-only sample data.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;