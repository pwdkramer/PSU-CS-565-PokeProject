export default function BattleHistoryEntry({key, text, type='self'}) {
  // type === 'self' | 'opponent'
  
  return (
    <li key={key} className={`historyElement ${type}`}>
      {`${text}`}
    </li>
  )
}