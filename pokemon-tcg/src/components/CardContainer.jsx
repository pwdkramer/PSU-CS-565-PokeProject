import Card from './Card';

export default function CardContainer({ cards, onCardClick, actionLabel }) {
  return (
    <ul className="cardContainer">
      {cards.map((card) => {
        return (
          <Card
            id={card.id}
            image={card.image}
            name={card.name}
            highres={true}
            onClick={() => onCardClick(card)}
            actionLabel={actionLabel}
          />
        );
      })}
    </ul>
  );
}
