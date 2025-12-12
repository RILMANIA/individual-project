import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { phase2Api } from "../helpers/http-client";

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeamAndCharacters();
  }, [id, navigate]);

  const fetchTeamAndCharacters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch team
      const teamResponse = await phase2Api.get("/myteams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const foundTeam = teamResponse.data.find((t) => t.id === parseInt(id));
      setTeam(foundTeam);

      // Fetch characters
      const charResponse = await phase2Api.get("/characters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCharacters(charResponse.data);

      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load team details");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCharacter = async () => {
    if (!selectedCharacterId) {
      alert("Please select a character");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await phase2Api.post(
        "/characterlists/add",
        {
          myTeamId: parseInt(id),
          characterId: parseInt(selectedCharacterId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedCharacterId("");
      fetchTeamAndCharacters();
    } catch (err) {
      console.error("Error adding character:", err);
      alert("Failed to add character to team");
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

  if (!team) {
    return <div className="container mt-3">Team not found</div>;
  }

  return (
    <div className="container mt-3">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/myteams")}
      >
        Back
      </button>
      <h1>{team.name}</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5>Add Character to Team</h5>
          <div className="input-group mb-3">
            <select
              className="form-select"
              value={selectedCharacterId}
              onChange={(e) => setSelectedCharacterId(e.target.value)}
            >
              <option value="">Select a character</option>
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddCharacter}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div>
        <h5>Team Members</h5>
        {team.CharacterLists && team.CharacterLists.length > 0 ? (
          <div className="row">
            {team.CharacterLists.map((member) => (
              <div key={member.id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6>Character ID: {member.characterId}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No characters in this team yet</p>
        )}
      </div>
    </div>
  );
}
