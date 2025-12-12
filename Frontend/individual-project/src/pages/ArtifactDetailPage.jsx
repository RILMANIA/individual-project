import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:3000";

export default function ArtifactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/artifacts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setArtifact(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching artifact:", err);
        setError("Failed to load artifact details");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtifact();
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

  if (!artifact) {
    return <div className="container mt-3">Artifact not found</div>;
  }

  return (
    <div className="container mt-3">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/artifacts")}
      >
        Back
      </button>
      <div className="card">
        <div className="card-body">
          <h1>{artifact.name}</h1>
          {artifact.description && (
            <p>
              <strong>Description:</strong> {artifact.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
