import { memo } from 'react';
import BattleActionsPanelEntry from './BattleActionsPanelEntry';

export default memo(function BattleActionsPanel({attackEffects, onClick}) {
  return (
    <aside id="battleActionsContainer">
      Battle Actions
      <ol id="battleActions">
        {Object.entries(attackEffects).map(([attackName, attackDetails]) => {
          return (
            <BattleActionsPanelEntry key={attackName} attackName={attackName} attackDetails={attackDetails} onClick={onClick}/>
          );
        })}
      </ol>
      </aside>
    )
})