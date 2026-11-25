import { useState } from 'react';

export default function CardSlot({ id, onCardDrop, canDrop = false}) {
  const [isDragOver, setDragOver] = useState(false);
  const myId = id;
  
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
    if (canDrop) {
      const id = e.dataTransfer.getData('text/plain');  
      if (id && onCardDrop) {
        onCardDrop(id, myId); // call the drop action function if exists
      }
    }
  };

  const classname = isDragOver ? 'openCardSlot isDraggedOver' : 'openCardSlot';

  return (
    <li 
      key={myId} 
      className={"cardWrapper cardSlot"}
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