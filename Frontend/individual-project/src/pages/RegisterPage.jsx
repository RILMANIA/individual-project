import { useState } from "react";
import { phase2Api } from "../helpers/http-client";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(event) {
    event.preventDefault();

    try {
      const newUser = await phase2Api.post("/register", {
        username,
        email,
        password,
      });

      // Show success message
      window.Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Registration successful. Please login.",
      });

      navigate("/login");
    } catch (err) {
      console.log("🚀 ~ handleRegister ~ err:", err.response.data.message);
      window.Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.message,
      });
    }
  }

  return (
    <section id="register-page">
      <div className="container-sm py-5">
        <h3 className="text-center">Register</h3>
        <form onSubmit={handleRegister} className="w-50 mx-auto py-5">
          <div className="mb-3">
            <label htmlFor="register-username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="register-username"
              autoComplete="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="register-email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="register-email"
              aria-describedby="emailHelp"
              autoComplete="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="register-password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="register-password"
              autoComplete="current-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-3">
              Register
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
