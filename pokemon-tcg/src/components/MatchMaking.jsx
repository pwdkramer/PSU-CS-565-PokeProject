import { useEffect, useState } from "react";

export default function MatchMaking({onClickHandler}) {
  const [seconds, setSeconds] = useState(0);

  // register the timer update
  useEffect(() => {
    const timer = setInterval(()=> {
      setSeconds((prev) => { 
        return prev + 1;
      });
    }, 1000)
    return () => clearInterval(timer); // when page is destroyed, end timer
  }, []);

  return (
    <div className="matchMakingWrapper">
      <h3>Searching For Opponent</h3>
      <p className="matchQueueTimer">{`${seconds}`}</p>
      <button type="button" className="matchCancelButton" onClick={onClickHandler}>
        Cancel Match
      </button>
    </div>
  )
}