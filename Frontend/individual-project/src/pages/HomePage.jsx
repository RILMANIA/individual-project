import { useEffect, useState } from "react";
import axios from "axios";
import PubCharacterCard from "../components/PubCharacterCard";

export default function HomePage() {
  const [characters, setCharacters] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://genshin.jmp.blue/characters");

      const data = response.data;
      setCharacters(data);
    } catch (err) {
      console.log("🚀 ~ fetchData ~ err:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-3 d-flex gap-3 flex-wrap">
      {characters.map((character, i) => (
        <PubCharacterCard key={i + 1} character={character} />
      ))}
    </div>
  );
}
