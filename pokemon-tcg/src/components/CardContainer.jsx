import Card from './Card';
import { memo } from 'react';

/*
  memo prevents this component from re-rendering on parent state change unless its 
  props explicitly change: see https://react.dev/reference/react/memo
*/

export default memo(function CardContainer({ cards, id, onCardClick, actionLabel, selectedCardId, registerCardRef, classNames = [] }) {
  const classes = ['cardContainer', ...classNames].join(' ');

  return (
    <ul id={id} className={classes}>
      {cards.map((card) => {
        const { id, image, name } = card;
        
        return (
          <Card id={id} 
            image={image} 
            name={name} 
            highres={true} 
            selected={selectedCardId === id}
            registerCardRef={registerCardRef}
            onClick={onCardClick ? () => onCardClick(card) : undefined}
            actionLabel={actionLabel}
          />);
      })}
    </ul>
  );
})
