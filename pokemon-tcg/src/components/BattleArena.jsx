import CardContainer, { getPlaceholder } from "./CardContainer";
import ScrollableCardContainer from "./ScrollableCardContainer";
import BattleHistory from "./BattleHistory";
import BattleActionsPanel from "./BattleActionsPanel";
import MatchMaking from "./MatchMaking.jsx";
import { useLoaderData } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect } from 'react'
import CARD_ANIMATIONS from '../animations/cardAnimations.js'
import socket from "../websocket/socket.js";
import socketEvents from "../websocket/socketEvents.js";

export default function BattleArena() {
  const { data, error } = useLoaderData();

  // const {shuffleCount = 1, deck = []} = data ?? {};
  const deck = data;

  const cardRefs = useRef(new Map());

  console.log(deck);
  console.log(deck.slice(0,7));
  const [matchMakingStatus, setMatchMakingStatus] = useState('searching');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [opponentBench, setOpponentBench] = useState(getPlaceholder(5));
  const [opponentActive, setOpponentActive] = useState(getPlaceholder(1));
  const [selfActive, setSelfActive] = useState(getPlaceholder(1));
  const [selfBench, setSelfBench] = useState(getPlaceholder(5));
  const [selfHand, setSelfHand] = useState(deck.slice(0,7));
  const [selfDeck, setSelfDeck] = useState(deck.slice(7));
  const [history, setHistory] = useState([]);
  const [battleActions, setBattleActions] = useState([]);
  const [battleAbility, setBattleAbility] = useState({});

  useEffect(() => {
    socket.emit(socketEvents.helloWorld, 'what up');
  }, [])

  const registerCardRef = useCallback((id, node) => {
    if (node) {
      cardRefs.current.set(id, node);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);
  const onActiveClickHandler = useCallback((card) => {
    console.log('in');
    setBattleActions(card.attacks);
    setSelected(card);
  }, []);
  const onBenchClickHandler = useCallback((card) => {
    // const actionData = card.abilities ? [...card.attacks, card.abilities] : card.attacks;
    setBattleActions(card.attacks);
    setSelected(card);
  }, []);
  const onDeckClickHandler = useCallback((card) => {
    console.log("deck", card);
  }, []);
  const onAttackClickHandler = useCallback(async (attack) => {
    console.log("attack", attack);
    console.log(selected);
    if (isAnimating || !selected) {
      return;
    }

    // need to validate attack is possible and websocket to server!
    // then, if successful:
    
    const attackingCard = cardRefs.current.get(selected.id);
    setIsAnimating(true);
    const animation = CARD_ANIMATIONS.AttackSelf;

    attackingCard.animate(
      animation.action,
      animation.timing
    );

    await animation.finished;

    if (selected) {
      setHistory((prev) => {
        return [
          ...prev, 
          {
            text: `${selected.name}: Attack using ${attack.name} for ${attack.damage} damage`,
            timestamp: Date.now(),
            historyType: 'self'
          }
        ];
    });
    }

    setIsAnimating(false);
  }, [selected, isAnimating]);

  const cancelSearchHandler = () => {
    setMatchMakingStatus("battle");
  }

  if (error) {
    return (
      <>
        <h1>Available Cards</h1>
        <p role="alert">Error: {error}</p>
      </>
    );
  }

  if (matchMakingStatus === 'searching') {
    return <MatchMaking onClickHandler={cancelSearchHandler}/>
  }

  if (matchMakingStatus === 'battle') {
    return (
      <div className="battleArena">
        
        <CardContainer cards={opponentBench} selectedCardId={selected?.id} id="opponentBench"/>
      
        <BattleHistory history={history} />
        
        <section id="centerStage">
          <CardContainer cards={opponentActive} selectedCardId={selected?.id} registerCardRef={registerCardRef} id="opponentActive"/>
          <img id="arenaIcon" src="battle-arena.jpg"/>
          <CardContainer cards={selfActive} selectedCardId={selected?.id} registerCardRef={registerCardRef} id="selfActive" canDrop={true} onCardClick={onActiveClickHandler}/>
          
        </section>
        
        <BattleActionsPanel attacks={battleActions} onClick={onAttackClickHandler}/>

        <CardContainer cards={selfBench} id="selfBench" selectedCardId={selected?.id} registerCardRef={registerCardRef} draggable={true} canDrop={true} onCardClick={onBenchClickHandler}/>
        <ScrollableCardContainer cards={selfHand} selectedCardId={selected?.id} id="selfHand" visibleCount={8} draggable={true} onCardClick={onDeckClickHandler}/>
      </div>
    )
  }
}