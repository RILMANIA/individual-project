import { useNavigate } from "react-router";

export default function WeaponCard({ weapon }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ width: "15rem" }}>
      {weapon.imgUrl && (
        <img
          src={weapon.imgUrl}
          className="card-img-top"
          alt={weapon.name}
          style={{ height: 200, objectFit: "cover" }}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{weapon.name}</h5>
        <p className="card-text">
          <strong>Type:</strong> {weapon.type}
        </p>
        <h5>
          <span className="badge text-bg-warning">{weapon.rarity}★</span>
        </h5>
        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={() => navigate(`/weapons/${weapon.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
