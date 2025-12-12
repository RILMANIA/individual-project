import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import axios from "axios";

export default function LoginPage() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("andi.prasetyo@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await axios.post(
        `https://p2.sonangga.com/apis/auth/login`,
        {
          email,
          password,
        }
      );

      // Response format: { "access_token": "jwt_token_here" }
      const token = response.data.access_token;
      localStorage.setItem("access_token", token);

      // Update NavBar state
      window.dispatchEvent(new Event("storage"));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message || "Invalid email/password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (localStorage.getItem("access_token")) {
    return <Navigate to="/" />;
  }

  return (
    <section id="login-page">
      <div className="container-sm py-5">
        <h3 className="text-center">Welcome To MyGenshinList</h3>
        <form onSubmit={handleLogin} className="w-50 mx-auto py-5">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="login-email"
              aria-describedby="emailHelp"
              autoComplete="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="login-password"
              autoComplete="current-password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="submit"
              className="btn btn-primary px-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={() => navigate("/register")}
              disabled={loading}
            >
              Register
            </button>
          </div>
          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="text-decoration-none">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
