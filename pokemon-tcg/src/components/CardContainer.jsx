import Card from './Card';

export default function CardContainer({ cards }) {
  return (
    <ul className="cardContainer">
      {cards.map(({ id, image, name }) => {
        return <Card id={id} image={image} name={name} highres={true} />;
      })}
    </ul>
  );
}
