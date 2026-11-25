import Card from './Card';
import CardSlot from './CardSlot';
import { memo } from 'react';

/*
  memo prevents this component from re-rendering on parent state change unless its 
  props explicitly change: see https://react.dev/reference/react/memo
*/

// generate a empty id, image, name object for use in CardContainer.jsx
export const getPlaceholder = function generatePlaceholderCard(count, idPrefix='') {
  const cards = Array.from({ length: count}, (_, i) => {
    return { 
      id: `${idPrefix}${i}`, 
      image: null, 
      name: null 
    };
  });

  return cards;
}

export default memo(function CardContainer({ cards, id, onCardClick, actionLabel, selectedCardId, registerCardRef, classNames = [], draggable=false, canDrop=false, onCardDrop }) {
  const classes = ['cardContainer', ...classNames].join(' ');
  
  return (
    <ul id={id} className={classes}>
      {cards.map((card) => {
        const { id, image, name } = card ?? {};
        
        {if (image) {
          return (
            <Card id={id} 
              image={image} 
              name={name} 
              highres={true} 
              selected={selectedCardId === id}
              registerCardRef={registerCardRef}
              onClick={onCardClick ? () => onCardClick(card) : undefined}
              actionLabel={actionLabel}
              draggable={draggable}
              canDrop={canDrop}
              onCardDrop={onCardDrop}
            />);
        }
        
        return (
          <CardSlot id={id} canDrop={canDrop} onCardDrop={onCardDrop}/>
        )}
      })}
    </ul>
  );
})
