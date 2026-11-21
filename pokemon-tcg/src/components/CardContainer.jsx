import Card from './Card';

export default function CardContainer({ cards, id, onCardClick, actionLabel, selectable, classNames = [] }) {
  const classes = ['cardContainer', ...classNames].join(' ');

  return (
    <ul id={id} className={classes}>
      {cards.map((card) => {
        const { id, image, name } = card;
        return (
          <Card id={id} 
            image={image} 
            name={name} 
            highres={false} 
            onClick={onCardClick ? () => onCardClick(card) : undefined}
            actionLabel={actionLabel}
            selectable={selectable}
          />);
      })}
    </ul>
  );
}
