import { useState } from "react";
import { phase2Api } from "../helpers/http-client";
import { Navigate, useNavigate } from "react-router";

export default function LoginPage() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("andi.prasetyo@gmail.com");
  const [password, setPassword] = useState("123456");

  async function handleLogin(event) {
    event.preventDefault();

    try {
      // POST /login -d {email, password}

      const response = await phase2Api.post("/login", {
        email,
        password,
      });

      const access_token = response.data.access_token;
      localStorage.setItem("access_token", access_token);

      navigate("/");
    } catch (err) {
      console.log("🚀 ~ handleLogin ~ err:", err.response.data.message);
      window.Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  }

  if (localStorage.getItem("access_token")) {
    return <Navigate to="/" />;
  }

  return (
    <section id="login-page">
      <div className="container-sm py-5">
        <h3 className="text-center">Welcome To MyRentalList</h3>
        <form onSubmit={handleLogin} className="w-50 mx-auto py-5">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-3">
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
