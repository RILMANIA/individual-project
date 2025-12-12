import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:3000";

export default function WeaponDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/weapons/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWeapon(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching weapon:", err);
        setError("Failed to load weapon details");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeapon();
  }, [id, navigate]);

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

  if (!weapon) {
    return <div className="container mt-3">Weapon not found</div>;
  }

  return (
    <div className="container mt-3">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/weapons")}
      >
        Back
      </button>
      <div className="card">
        <div className="card-body">
          <h1>{weapon.name}</h1>
          <p>
            <strong>Type:</strong> {weapon.type}
          </p>
          <p>
            <strong>Rarity:</strong> {weapon.rarity}★
          </p>
          {weapon.description && (
            <p>
              <strong>Description:</strong> {weapon.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
