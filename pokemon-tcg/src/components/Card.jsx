export default function Card({ id, image, name, highres, selected, onClick,  registerCardRef, buttonLabel }) {
  const cardImage = (    
    <img
      className="cardImage"
      src={highres ? `${image}/high.webp` : `${image}/low.webp`}
      alt={`Card ID: ${id} With name: ${name}`}
      loading="lazy"
      />
  );

  return (
    <li 
      key={id} 
      className={selected ? "cardWrapper selected" : "cardWrapper"}
      ref={(node) =>  registerCardRef?.(id, node)}
    >
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
  )
}
