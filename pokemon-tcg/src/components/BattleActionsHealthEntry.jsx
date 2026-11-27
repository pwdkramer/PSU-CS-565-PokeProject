export default function BattleActionsHealthEntry({ selected }) {
  return (
    <li key={'HP'} className={'battleActionsPanelEntry'}>
      <div className={'hpPanel'}>{`HP: ${selected.hp}`}</div>
    </li>
  );
}
