export default function Card({ id, image, name, highres }) {
  return (
    <li key={id} className="cardWrapper">
      <img
        className="cardImage"
        src={highres ? `${image}/high.webp` : `${image}/low.webp`}
        alt={`Card ID: ${id} With name: ${name}`}
        loading="lazy"
      />
    </li>
  );
}
