import { useState } from 'react';
import { memo } from 'react';
import CardContainer from './CardContainer';

/*
  memo prevents this component from re-rendering on parent state change unless its 
  props explicitly change: see https://react.dev/reference/react/memo
*/

export default memo(function ScrollableCardContainer({
  cards = [],
  id,
  visibleCount = 6,
  selectedCardId,
  registerCardRef,
  onCardClick,
  draggable,
}) {
  const [scrollIndex, setScrollIndex] = useState(0); // indexes the card to be shown on the far left
  
  const lastIndex = Math.max(0, cards.length - visibleCount); // lastIndex for right-scroll
  const trueStart = Math.min(scrollIndex, lastIndex); // ensure that scrollIndex <= lastIndex (dont scroll past this)
  const visibleCards = cards.slice(trueStart, trueStart + visibleCount);

  const canScrollLeft = trueStart > 0;
  const canScrollRight = trueStart < lastIndex;

  return (
    <div id={id} className="scrollableCardContainer">
      <button 
        type="button" 
        className="navigationButton navigateLeft" 
        disabled={!canScrollLeft}
        arial-label="leftScroll"
        onClick={()=>{
          setScrollIndex(Math.max(0, trueStart-1));
        }}>
          {'\u227A'}
      </button>
      <CardContainer 
        cards={visibleCards} 
        selected={selectedCardId === id}
        onCardClick={onCardClick}
        registerCardRef={registerCardRef}
        draggable={draggable}
      />
      <button 
        type="button" 
        className="navigationButton navigateRight" 
        disabled={!canScrollRight}
        arial-label="rightScroll"
        onClick={()=>{
          setScrollIndex(Math.min(trueStart+1, lastIndex));
        }}>
          {'\u227B'}
      </button>
    </div>
  )
})