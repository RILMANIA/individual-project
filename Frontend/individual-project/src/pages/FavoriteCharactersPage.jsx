import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:3000";

export default function FavoriteCharactersPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [genError, setGenError] = useState("");
  const [generating, setGenerating] = useState(false);
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

        const response = await axios.get(`${API_URL}/favoritecharacters`, {
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

  useEffect(() => {
    return () => {
      if (generatedImageUrl && generatedImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(generatedImageUrl);
      }
    };
  }, [generatedImageUrl]);

  const handleRemoveFavorite = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${API_URL}/favoritecharacters/${id}`, {
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

  const handleGenerateImage = async (event) => {
    event.preventDefault();
    const description = prompt.trim();
    if (!description) {
      setGenError("Please enter a description.");
      return;
    }

    setGenerating(true);
    setGenError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/ai/deepseek-image`,
        { prompt: description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data?.imageUrl) {
        throw new Error("No image returned");
      }

      setGeneratedImageUrl(response.data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
      setGenError("Failed to generate image. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="container mt-3">Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <h1>Favorite Characters</h1>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Create a custom character image</h5>
          <form className="row g-2" onSubmit={handleGenerateImage}>
            <div className="col-12 col-md-9">
              <input
                type="text"
                className="form-control"
                placeholder="Describe the character (e.g., 'an electro swordsman with purple armor') — Genshin-style is applied automatically"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={generating}
              />
            </div>
            <div className="col-12 col-md-3 d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={generating}
              >
                {generating ? "Generating..." : "Generate Image"}
              </button>
            </div>
          </form>
          {genError && (
            <div className="alert alert-danger mt-2">{genError}</div>
          )}
          {generatedImageUrl && (
            <div className="mt-3 text-center">
              <img
                src={generatedImageUrl}
                alt="Generated character"
                className="img-fluid rounded"
                style={{ maxHeight: 320, objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>
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
