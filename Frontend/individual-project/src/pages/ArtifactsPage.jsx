import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ArtifactCard from "../components/ArtifactCard";
import { phase2Api } from "../helpers/http-client";

export default function ArtifactsPage() {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await phase2Api.get(`/artifacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setArtifacts(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching artifacts:", err);
        setError("Failed to load artifacts");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtifacts();
  }, [navigate]);

  if (loading) {
    return <div className="container mt-3">Loading...</div>;
  }

  return (
    <div className="container mt-3 d-flex gap-3 flex-wrap">
      {artifacts.map((artifact) => (
        <ArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </div>
  );
}
