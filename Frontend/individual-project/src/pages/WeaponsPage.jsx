import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import WeaponCard from "../components/WeaponCard";

const API_URL = "http://localhost:3000";

export default function WeaponsPage() {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/weapons`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWeapons(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching weapons:", err);
        setError("Failed to load weapons");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeapons();
  }, [navigate]);

  if (loading) {
    return <div className="container mt-3">Loading...</div>;
  }

  return (
    <div className="container mt-3 d-flex gap-3 flex-wrap">
      {weapons.map((weapon) => (
        <WeaponCard key={weapon.id} weapon={weapon} />
      ))}
    </div>
  );
}
