import { memo } from 'react';
import BattleActionsPanelEntry from './BattleActionsPanelEntry';

export default memo(function BattleActionsPanel({attacks, onClick}) {
  return (
    <aside id="battleActionsContainer">
      Battle Actions
      <ol id="battleActions">
        {attacks.map((attack) => {
          return (
            <BattleActionsPanelEntry attack={attack} onClick={onClick}/>
          );
        })}
      </ol>
      </aside>
    )
})