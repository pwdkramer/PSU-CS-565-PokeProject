export default function BattleActionsAbilityEntry({ ability, onAbility }) {
  const { name, effect } = ability;

  return (
    <li key={name} className={'battleActionsPanelEntry'}>
      <span class="attackNameBadge attackAbilityBadge">{name}</span>
      <button
        type="button"
        className="battleActionsPanelButton"
        onClick={onAbility ? () => onAbility(ability) : undefined}
      >
        <div className="attackEffect">
          <p className="effectDescription">{effect}</p>
        </div>
      </button>
    </li>
  );
}
