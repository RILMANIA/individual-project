import { useMemo } from "react";

export default function PubCharacterCard({ character }) {
  const name = useMemo(() => {
    if (typeof character === "string") return character;
    return character?.name || "Unknown";
  }, [character]);

  const imageSrc = useMemo(() => {
    const base =
      "https://res.cloudinary.com/dnoibyqq2/image/upload/v1617899636/genshin-app/characters";
    if (typeof character === "object" && character?.imgUrl)
      return character.imgUrl;
    const slugNoSpace = name?.toLowerCase().replace(/\s+/g, "") || "";
    const slugDash = name?.toLowerCase().replace(/\s+/g, "-") || "";
    return `${base}/${slugNoSpace || slugDash}/card.jpg`;
  }, [character, name]);

  return (
    <div className="card" style={{ width: "15rem" }}>
      <img
        src={imageSrc}
        className="card-img-top"
        alt={name}
        style={{ height: 200, objectFit: "cover" }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/240x200?text=No+Image";
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
      </div>
    </div>
  );
}
