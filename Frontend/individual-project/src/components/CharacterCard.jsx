export default function CharacterCard({ character }) {
  return (
    <div className="card" style={{ width: "15rem" }}>
      <img
        src={character.imgUrl}
        className="card-img-top"
        alt="..."
        style={{ height: 200, objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{character.name}</h5>
        <p className="card-text">{character.description}</p>
        <h5>
          <span className="badge text-bg-warning">{character.title}</span>
        </h5>
      </div>
    </div>
  );
}
