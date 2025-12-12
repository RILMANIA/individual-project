import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { phase2Api } from "../helpers/http-client";
import CharacterCard from "../components/CharacterCard";

export default function CharactersPage() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await phase2Api.get("/characters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCharacters(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching characters:", err);
      setError("Failed to load characters");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  if (loading) {
    return <div className="container mt-3">Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <h1>Characters</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex gap-3 flex-wrap">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}
