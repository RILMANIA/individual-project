import { useNavigate } from "react-router";

export default function MyTeamCard({ team, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ width: "15rem" }}>
      <div className="card-body">
        <h5 className="card-title">{team.name}</h5>
        <p className="card-text">
          <strong>Members:</strong> {team.CharacterLists?.length || 0}
        </p>
        <button
          className="btn btn-info btn-sm"
          onClick={() => navigate(`/myteams/${team.id}`)}
        >
          View Team
        </button>
        <button
          className="btn btn-danger btn-sm ms-2"
          onClick={() => onDelete(team.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
