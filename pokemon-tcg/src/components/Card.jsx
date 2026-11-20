export default function Card({ id, image, name, highres, onClick, buttonLabel }) {
  const cardImage = (
    <img
      className="cardImage"
      src={highres ? `${image}/high.webp` : `${image}/low.webp`}
      alt={`Card ID: ${id} With name: ${name}`}
      loading="lazy"
    />
  );

  return (
    <li className="cardWrapper">
      {onClick ? (
        <button
          type="button"
          className="card-button"
          onClick={onClick}
          aria-label={buttonLabel}
        >
          {cardImage}
        </button>
      ) : (
        cardImage
      )}
    </li>
  );
}
