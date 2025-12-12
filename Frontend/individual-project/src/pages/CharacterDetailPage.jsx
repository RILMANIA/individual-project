import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:3000";

export default function CharacterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/characters/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCharacter(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching character:", err);
        setError("Failed to load character details");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id, navigate]);

  const handleAddFavorite = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${API_URL}/characters/${id}/addfavorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Character added to favorites!");
    } catch (err) {
      console.error("Error adding to favorites:", err);
      alert("Failed to add character to favorites");
    }
  };

  if (loading) {
    return <div className="container mt-3">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mt-3">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!character) {
    return <div className="container mt-3">Character not found</div>;
  }

  return (
    <div className="container mt-3">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/characters")}
      >
        Back
      </button>
      <div className="card">
        <div className="row g-0">
          {character.imgUrl && (
            <div className="col-md-4">
              <img
                src={character.imgUrl}
                alt={character.name}
                className="img-fluid rounded-start"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>
          )}
          <div className={character.imgUrl ? "col-md-8" : "col-md-12"}>
            <div className="card-body">
              <h1 className="card-title">{character.name}</h1>
              {character.title && (
                <h5 className="text-muted">{character.title}</h5>
              )}

              <div className="mt-3">
                {character.vision && (
                  <p>
                    <strong>Vision:</strong>{" "}
                    <span className="badge bg-warning text-dark">
                      {character.vision}
                    </span>
                  </p>
                )}
                {character.weapon && (
                  <p>
                    <strong>Weapon:</strong> {character.weapon}
                  </p>
                )}
                {character.rarity && (
                  <p>
                    <strong>Rarity:</strong> {character.rarity}★
                  </p>
                )}
                {character.nation && (
                  <p>
                    <strong>Nation:</strong> {character.nation}
                  </p>
                )}
                {character.affiliation && (
                  <p>
                    <strong>Affiliation:</strong> {character.affiliation}
                  </p>
                )}
                {character.constellation && (
                  <p>
                    <strong>Constellation:</strong> {character.constellation}
                  </p>
                )}
                {character.gender && (
                  <p>
                    <strong>Gender:</strong> {character.gender}
                  </p>
                )}
              </div>

              {character.description && (
                <div className="mt-3">
                  <h5>Description</h5>
                  <p>{character.description}</p>
                </div>
              )}

              <button
                className="btn btn-success mt-3"
                onClick={handleAddFavorite}
              >
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
