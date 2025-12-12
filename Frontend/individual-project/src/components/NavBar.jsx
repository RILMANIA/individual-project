import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          MyGenshinlist
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/characters">
                    Characters
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/weapons">
                    Weapons
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/artifacts">
                    Artifacts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/favoritecharacters">
                    Favorites
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myteams">
                    My Teams
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex gap-2">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-success">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
