import { useNavigate } from "react-router";

export default function ArtifactCard({ artifact }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ width: "15rem" }}>
      {artifact.imgUrl && (
        <img
          src={artifact.imgUrl}
          className="card-img-top"
          alt={artifact.name}
          style={{ height: 200, objectFit: "cover" }}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{artifact.name}</h5>
        {artifact.description && (
          <p className="card-text">{artifact.description}</p>
        )}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/artifacts/${artifact.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
