export default function BattleActionsTrainerEntry({ selected }) {
  return (
    <li key={selected.id} className={'battleActionsPanelEntry'}>
      <p className="effectDescription">{selected.effect}</p>
    </li>
  );
}
