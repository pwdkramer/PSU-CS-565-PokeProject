import { useState } from 'react';

export default function CardSlot({ id, onCardDrop, canDrop = false}) {
  const [isDragOver, setDragOver] = useState(false);
  
  const handleDragOver = (e) => {
    if (canDrop) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move'; // controls the feedback given to user about the drag action
      // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect 
      if (!isDragOver) {
        setDragOver(true);
      }
    }
  };

  const handleDragLeave = () => {
    if (isDragOver) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    console.log('droped');
    if (canDrop) {
      const id = e.dataTransfer.getData('text/plain');
      console.log(id);
      if (id && onCardDrop) {
        onCardDrop(id); // call the drop action function if exists
      }
    }
  };

  const classname = isDragOver ? 'openCardSlot isDraggedOver' : 'openCardSlot';

  return (
    <li 
      key={id ?? 'placeholder'} 
      className={"cardWrapper"}
    >
      <div 
        className={classname}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >

      </div>
    </li>
  )
}