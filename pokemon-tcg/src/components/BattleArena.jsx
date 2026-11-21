import CardContainer from "./CardContainer";
import ScrollableCardContainer from "./ScrollableCardContainer";
import BattleHistory from "./BattleHistory";
import { useLoaderData } from 'react-router-dom';
import {useState } from 'react'

export default function BattleArena() {
  const { data, error } = useLoaderData();
  console.log(data);
  const {opponentBench:_opponentBench = [], opponentActive:_opponentActive = [], selfActive:_selfActive = [], selfBench:_selfBench = [], selfDeck:_selfDeck = []} = data ?? {};

  const [opponentBench, setOpponentBench] = useState(_opponentBench);
  const [opponentActive, setOpponentActive] = useState(_opponentActive);
  const [selfActive, setSelfActive] = useState(_selfActive);
  const [selfBench, setSelfBench] = useState(_selfBench);
  const [selfDeck, setSelfDeck] = useState(_selfDeck);
  const [history, setHistory] = useState([]);
  const [battleActions, setBattleActions] = useState([]);

  if (error) {
    return (
      <>
        <h1>Available Cards</h1>
        <p role="alert">Error: {error}</p>
      </>
    );
  }

  return (
    <div className="battleArena">
      
      <CardContainer cards={opponentBench} id="opponentBench"/>
    
      <BattleHistory history={history} />
      
      <section id="centerStage">
        
        <CardContainer cards={opponentActive} id="opponentActive"/>
        <img id="arenaIcon" src="battle-arena.jpg"/>
        <CardContainer cards={selfActive} id="selfActive" onCardClick={(foo) => foo}/>
        
      </section>
      
      <aside id="battleActions">Battle Actions</aside>
      
      <CardContainer cards={selfBench} id="selfBench" onCardClick={(foo) => foo}/>
      <ScrollableCardContainer cards={selfDeck} id="selfDeck" visibleCount={8} onCardClick={(foo) => foo}/>
    </div>
  )
}