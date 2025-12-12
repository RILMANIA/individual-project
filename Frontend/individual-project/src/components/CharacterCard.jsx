import { useNavigate } from "react-router";
import { phase2Api } from "../helpers/http-client";

export default function CharacterCard({ character }) {
  const navigate = useNavigate();

  async function handleAddFavorite() {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      await phase2Api.post(
        `/characters/${character.id}/addfavorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.alert("Character added to favorites");
    } catch (err) {
      console.error("Error adding favorite:", err);
      const message =
        err.response?.data?.message || "Failed to add character to favorites";
      window.alert(message);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  }

  return (
    <div className="card" style={{ width: "15rem" }}>
      {character.imgUrl ? (
        <img
          src={character.imgUrl}
          className="card-img-top"
          alt={character.name}
          style={{ height: 200, objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/240x200?text=No+Image";
          }}
        />
      ) : (
        <div
          style={{
            height: 200,
            backgroundColor: "#e9ecef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>No Image Available</p>
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title">{character.name}</h5>
        {character.title && (
          <p className="card-text">
            <small className="text-muted">{character.title}</small>
          </p>
        )}
        {character.description && (
          <p className="card-text" style={{ fontSize: "0.85rem" }}>
            {character.description.substring(0, 50)}...
          </p>
        )}
        {character.vision && (
          <h6>
            <span className="badge text-bg-warning">{character.vision}</span>
          </h6>
        )}
        {character.rarity && (
          <p className="card-text">
            <strong>Rarity:</strong> {character.rarity}★
          </p>
        )}
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/characters/${character.id}`)}
          >
            View Details
          </button>
          <button
            className="btn btn-success btn-sm"
            onClick={handleAddFavorite}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
