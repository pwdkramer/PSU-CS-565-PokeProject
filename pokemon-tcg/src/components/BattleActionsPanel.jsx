import { memo } from 'react';
import BattleActionsPanelEntry from './BattleActionsPanelEntry';
import BattleActionsHealthEntry from './BattleActionsHealthEntry';
import BattleActionsTrainerEntry from './BattleActionsTrainerEntry';
import BattleActionsAbilityEntry from './BattleActionsAbilityEntry';

export default memo(function BattleActionsPanel({
  attacks,
  selectedCard,
  onClick,
  onAbility,
}) {
  if (!selectedCard) return;

  const rowData = [];

  if (selectedCard.category === 'Pokemon') {
    rowData.push(<BattleActionsHealthEntry selected={selectedCard} />);
    rowData.push(
      ...attacks.map((attack) => {
        return <BattleActionsPanelEntry attack={attack} onClick={onClick} />;
      }),
    );
    selectedCard.abilities &&
      rowData.push(
        <BattleActionsAbilityEntry
          ability={selectedCard.abilities[0]}
          onAbility={onAbility}
        />,
      );
  } else if (selectedCard.category === 'Trainer') {
    rowData.push(<BattleActionsTrainerEntry selected={selectedCard} />);
  }

  return (
    <aside id="battleActionsContainer">
      Battle Actions
      <ol id="battleActions">{rowData}</ol>
    </aside>
  );
});
