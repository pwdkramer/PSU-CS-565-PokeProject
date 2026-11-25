export default function Card({ id, image, name, highres, selected, onClick,  registerCardRef, buttonLabel, draggable=false, onDragStart, onDragEnd, canDrop=false }) {
  const cardImage = (    
    <img
      className="cardImage"
      src={highres ? `${image}/high.webp` : `${image}/low.webp`}
      alt={`Card ID: ${id} With name: ${name}`}
      loading="lazy"
      draggable={false}
      />
  );

  return (
    <li 
      key={id} 
      className={selected ? "cardWrapper selected" : "cardWrapper"}
      ref={(node) =>  registerCardRef?.(id, node)}
      draggable={draggable}
      onDragStart={(e)=> {
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.(id);
      }}
      onDragEnd={() => { onDragEnd?.(id)}}
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
