import { memo } from 'react';
import BattleActionsPanelEntry from './BattleActionsPanelEntry';

export default memo(function BattleActionsPanel({attacks, selectedCard, onClick}) {
  return (
    <aside id="battleActionsContainer">
      Battle Actions
      <ol id="battleActions">
        { selectedCard && 
          attacks.map((attack) => {
            return (
              <BattleActionsPanelEntry attack={attack} onClick={onClick}/>
            );
        })}
      </ol>
      </aside>
    )
})