import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { phase2Api } from "../helpers/http-client";

export default function FavoriteCharactersPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await phase2Api.get(`/favoritecharacters`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFavorites(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching favorite characters:", err);
        setError("Failed to load favorite characters");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleRemoveFavorite = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await phase2Api.delete(`/favoritecharacters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove favorite character");
    }
  };

  if (loading) {
    return <div className="container mt-3">Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <h1>Favorite Characters</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex gap-3 flex-wrap">
        {favorites.length === 0 ? (
          <p>No favorite characters yet</p>
        ) : (
          favorites.map((favorite) => (
            <div key={favorite.id} className="card" style={{ width: "15rem" }}>
              {favorite.imgUrl && (
                <img
                  src={favorite.imgUrl}
                  className="card-img-top"
                  alt={favorite.name}
                  style={{ height: 200, objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/240x200?text=No+Image";
                  }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">
                  {favorite.name || `Character ID: ${favorite.characterId}`}
                </h5>
                {favorite.title && (
                  <p className="card-text">
                    <small className="text-muted">{favorite.title}</small>
                  </p>
                )}
                {favorite.vision && (
                  <h6>
                    <span className="badge text-bg-warning">
                      {favorite.vision}
                    </span>
                  </h6>
                )}
                {favorite.rarity && (
                  <p className="card-text">
                    <strong>Rarity:</strong> {favorite.rarity}★
                  </p>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveFavorite(favorite.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
