import CardContainer from "./CardContainer";
import ScrollableCardContainer from "./ScrollableCardContainer";
import BattleHistory from "./BattleHistory";
import BattleActionsPanel from "./BattleActionsPanel";
import { useLoaderData } from 'react-router-dom';
import {useState } from 'react'

export default function BattleArena() {
  const { data, error } = useLoaderData();
  
  const {opponentBench:_opponentBench = [], opponentActive:_opponentActive = [], selfActive:_selfActive = [], selfBench:_selfBench = [], selfDeck:_selfDeck = []} = data ?? {};

  const [opponentBench, setOpponentBench] = useState(_opponentBench);
  const [opponentActive, setOpponentActive] = useState(_opponentActive);
  const [selfActive, setSelfActive] = useState(_selfActive);
  const [selfBench, setSelfBench] = useState(_selfBench);
  const [selfDeck, setSelfDeck] = useState(_selfDeck);
  const [history, setHistory] = useState([
    {
      text: "test message blahlb lhablhalhlksdlfjalsdfjksdlfjslkdjfklasjdfljsdlfjlasdjflsjdlfjdslf",
      timestamp: Date.now(),
      historyType: 'self'
    },
    {
      text: "test message blahlb lhablhalhlksdlfjalsdfjksdlfjslkdjfklasjdfljsdlfjlasdjflsjdlfjdslf",
      timestamp: Date.now(),
      historyType: 'opponent'
    },
  ]);
  const [battleActions, setBattleActions] = useState({
      // Chansey
      Scrunch: [
        "Flip a coin. If heads, prevent all damage done to Chansey during your opponent's next turn. (Any other effects of attacks still happen.)"
        ],
      'Double-edge': [
        "Chansey does 80 damage to itself."
      ]
    });

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
      
      <BattleActionsPanel attackEffects={battleActions} onClick={(foo) => foo}/>
      
      <CardContainer cards={selfBench} id="selfBench" onCardClick={(foo) => foo}/>
      <ScrollableCardContainer cards={selfDeck} id="selfDeck" visibleCount={8} onCardClick={(foo) => foo}/>
    </div>
  )
}