import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MyTeamCard from "../components/MyTeamCard";
import { phase2Api } from "../helpers/http-client";

export default function MyTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, [navigate]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await phase2Api.get(`/myteams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeams(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError("Failed to load teams");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await phase2Api.post(
        `/myteams`,
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeamName("");
      fetchTeams();
    } catch (err) {
      console.error("Error creating team:", err);
      alert("Failed to create team");
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await phase2Api.delete(`/myteams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTeams();
    } catch (err) {
      console.error("Error deleting team:", err);
      alert("Failed to delete team");
    }
  };

  if (loading) {
    return <div className="container mt-3">Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <h1>My Teams</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleCreateTeam} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Create Team
          </button>
        </div>
      </form>

      <div className="d-flex gap-3 flex-wrap">
        {teams.length === 0 ? (
          <p>No teams yet. Create one to get started!</p>
        ) : (
          teams.map((team) => (
            <MyTeamCard key={team.id} team={team} onDelete={handleDeleteTeam} />
          ))
        )}
      </div>
    </div>
  );
}
