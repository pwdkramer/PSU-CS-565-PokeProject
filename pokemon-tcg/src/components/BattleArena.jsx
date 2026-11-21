import CardContainer from "./CardContainer";
import Card from "./Card";
import { useLoaderData } from 'react-router-dom';

export default function BattleArena() {
  const { data, error } = useLoaderData();
  
  if (error) {
    return (
      <>
        <h1>Available Cards</h1>
        <p role="alert">Error: {error}</p>
      </>
    );
  }

  const {opponentBench, opponentActive, selfActive, selfBench, selfDeck} = data;
  
  return (
    <div className="battleArena">
      
      <CardContainer cards={opponentBench} id="opponentBench"/>
      <aside id="battleHistory">Battle History</aside>
      
      <section id="centerStage">
        
        <CardContainer cards={opponentActive} id="opponentActive" onCardClick={(foo) => foo}/>
        <img id="arenaIcon" src="bg-forest.jpg"/>
        <CardContainer cards={selfActive} id="selfActive" onCardClick={(foo) => foo}/>
        
      </section>
      
      <aside id="battleActions">Battle Actions</aside>
      
      <CardContainer cards={selfBench} id="selfBench" onCardClick={(foo) => foo}/>
      <CardContainer cards={selfDeck} id="selfDeck"/>
    </div>
  )
}