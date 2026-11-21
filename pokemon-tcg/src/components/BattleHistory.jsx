import { memo } from 'react';
import BattleHistoryEntry from "./BattleHistoryEntry"

export default memo(function BattleHistory({history}) {
  return (
  <aside id="battleHistoryContainer">
    Battle History
    <ol id="battleHistory">
      {history.map((entry) => {
        const {text, timestamp, historyType} = entry;
        return (
          <BattleHistoryEntry key={timestamp} text={text} type={historyType} />
        );
      })}
    </ol>
    </aside>
  )
})