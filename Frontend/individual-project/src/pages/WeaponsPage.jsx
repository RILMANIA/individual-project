import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { phase2Api } from "../helpers/http-client";
import WeaponCard from "../components/WeaponCard";

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

        const response = await phase2Api.get("/weapons", {
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
