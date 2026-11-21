export default function BattleActionsPanelEntry({key, attackName, attackDetails, onClick}) { 
  return (
    <li key={key} className={'battleActionsPanelEntry'}>
      <button 
        type="button" 
        className="battleActionsPanelButton"
        onClick={onClick ? onClick : undefined}>
          <h5>{attackName}</h5>
          <p>TO DO!</p>
      </button>
    </li>
  )
}