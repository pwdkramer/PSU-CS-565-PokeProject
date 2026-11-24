import CardContainer from "./CardContainer";
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

  const {opponentBench:_opponentBench = [], opponentActive:_opponentActive = [], selfActive:_selfActive = [], selfBench:_selfBench = [], selfDeck:_selfDeck = []} = data ?? {};

  const cardRefs = useRef(new Map());
  const [matchMakingStatus, setMatchMakingStatus] = useState('searching');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [opponentBench, setOpponentBench] = useState(_opponentBench);
  const [opponentActive, setOpponentActive] = useState(_opponentActive);
  const [selfActive, setSelfActive] = useState(_selfActive);
  const [selfBench, setSelfBench] = useState(_selfBench);
  const [selfDeck, setSelfDeck] = useState(_selfDeck);
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
          <CardContainer cards={selfActive} selectedCardId={selected?.id} registerCardRef={registerCardRef} id="selfActive" onCardClick={onActiveClickHandler}/>
          
        </section>
        
        <BattleActionsPanel attacks={battleActions} onClick={onAttackClickHandler}/>
        
        <CardContainer cards={selfBench} id="selfBench" selectedCardId={selected?.id} registerCardRef={registerCardRef} onCardClick={onBenchClickHandler}/>
        <ScrollableCardContainer cards={selfDeck} selectedCardId={selected?.id} id="selfDeck" visibleCount={8} onCardClick={onDeckClickHandler}/>
      </div>
    )
  }
}