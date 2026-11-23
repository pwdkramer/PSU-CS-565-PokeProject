const costIconLookup = {
  'Psychic': 'costIcons/Psychic-attack.png',
  'Colorless': 'costIcons/Colorless-attack.png',
  'Fire': 'costIcons/Fire-attack.png',
  'Grass': 'costIcons/Grass-attack.png',
  'Lightning': 'costIcons/Lightning-attack.png',
  'Fighting': 'costIcons/Fighting-attack.png',
  'Water': 'costIcons/Water-attack.png',
}

export default function BattleActionsPanelEntry({attack, onClick}) { 
  const {name, damage, cost, effect} = attack;
  const hasEffect = Boolean(effect?.trim());

  return (
    <li key={name} className={'battleActionsPanelEntry'}>
      <span class="attackNameBadge">{name}</span>
      <button 
        type="button" 
        className="battleActionsPanelButton"
        onClick={onClick ? () => onClick(attack) : undefined}>
          <div className="attackInfoMain">
            <span className="attackCost">{cost.map((type) => {
              return (    
                <img
                  className="costIcon"
                  src={costIconLookup[type]}
                  alt={`Card Icon Type: ${type}`}
                  height="25"
                  width="25"
                  loading="lazy"
                  />
              );
            })}</span>
            <span className="attackDamage">{damage || 'NONE'}</span>
          </div>
          {hasEffect && ( 
            <div className="attackEffect">
              <p className="effectDescription">
                {effect}
              </p>
            </div>
          )}
      </button>
    </li>
  )
}