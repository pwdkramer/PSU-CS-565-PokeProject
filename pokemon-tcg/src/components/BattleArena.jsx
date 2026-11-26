import CardContainer, { getPlaceholder } from './CardContainer';
import ScrollableCardContainer from './ScrollableCardContainer';
import BattleHistory from './BattleHistory';
import BattleActionsPanel from './BattleActionsPanel';
import MatchMaking from './MatchMaking.jsx';
import { useLoaderData } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect } from 'react';
import CARD_ANIMATIONS from '../animations/cardAnimations.js';
import socket from '../websocket/socket.js';
import socketEvents from '../websocket/socketEvents.js';
import { PlayerContext } from '../types/gameContext.js';

export default function BattleArena() {
  const { data, error } = useLoaderData();

  // const {shuffleCount = 1, deck = []} = data ?? {};
  const deck = data;

  const cardRefs = useRef(new Map());
  const playerContext = useRef(new PlayerContext());

  const [matchMakingStatus, setMatchMakingStatus] = useState('searching');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [opponentBench, setOpponentBench] = useState(
    getPlaceholder(5, 'opponentBench'),
  );
  const [opponentActive, setOpponentActive] = useState(
    getPlaceholder(1, 'opponentActive'),
  );
  const [selfActive, setSelfActive] = useState(getPlaceholder(1, 'selfActive'));
  const [selfBench, setSelfBench] = useState(getPlaceholder(5, 'selfBench'));
  const [selfHand, setSelfHand] = useState(deck.slice(0, 7));
  const [selfDeck, setSelfDeck] = useState(deck.slice(7));
  const [history, setHistory] = useState([]);
  const [battleActions, setBattleActions] = useState([]);
  const [battleAbility, setBattleAbility] = useState({});

  useEffect(() => {
    socket.emit(socketEvents.matchMakeRequest);
    socket.on(socketEvents.battleStart, () => setMatchMakingStatus('battle'));
    socket.on(socketEvents.contextUpdate, (opponentContext) => {
      setOpponentActive([opponentContext.attacker]);
      setOpponentBench(opponentContext.bench);
    });
  }, []);

  const registerCardRef = useCallback((id, node) => {
    if (node) {
      cardRefs.current.set(id, node);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);
  const onActiveClickHandler = useCallback((card) => {
    setBattleActions(card.attacks);
    setSelected(card);
  }, []);
  const onBenchClickHandler = useCallback((card) => {
    // const actionData = card.abilities ? [...card.attacks, card.abilities] : card.attacks;
    setBattleActions(card.attacks);
    setSelected(card);
  }, []);
  const onAttackClickHandler = useCallback(
    async (attack) => {
      if (isAnimating || !selected) {
        return;
      }
      console.log(selected, selfActive);
      if (selected.id !== selfActive[0].id) {
        return;
      }

      // need to validate attack is possible and websocket to server!
      // then, if successful:

      const attackingCard = cardRefs.current.get(selected.id);
      setIsAnimating(true);
      const animation = CARD_ANIMATIONS.AttackSelf;

      attackingCard.animate(animation.action, animation.timing);

      await animation.finished;

      if (selected) {
        setHistory((prev) => {
          return [
            ...prev,
            {
              text: `${selected.name}: Attack using ${attack.name} for ${attack.damage} damage`,
              timestamp: Date.now(),
              historyType: 'self',
            },
          ];
        });
      }

      setIsAnimating(false);
    },
    [selected, isAnimating],
  );
  const onCardDrop = useCallback(
    (movingId, replacedId) => {
      const hand = selfHand.find((card) => card.id === movingId);
      const active = selfActive.find((card) => card.id === movingId);
      const bench = selfBench.find((card) => card.id === movingId);
      const movingCard = hand ?? active ?? bench;

      if (!movingCard) return;

      // prevent dropping on self
      if (hand && hand.id === replacedId) return;
      if (active && active.id === replacedId) return;
      if (bench && bench.id === replacedId) return;

      let nextHand = selfHand;
      let nextActive = selfActive;
      let nextBench = selfBench;

      // remove moving card from correct place
      if (hand) {
        // hand gets smaller
        nextHand = selfHand.filter((card) => card.id !== movingId);
      } else if (active) {
        const movingIndex = selfActive.indexOf(active);
        const temp = getPlaceholder(1, 'selfActive')[0];
        temp.id = `selfActive${movingIndex}`;
        nextActive = selfActive.with(movingIndex, temp);
      } else if (bench) {
        const movingIndex = selfBench.indexOf(bench);
        const temp = getPlaceholder(1, 'selfBench')[0];
        temp.id = `selfBench${movingIndex}`;
        nextBench = selfBench.with(movingIndex, temp);
      }

      // insert moving card to correct place
      if (replacedId.startsWith('selfBench')) {
        const replacedIndex = Number(replacedId.replace('selfBench', ''));
        nextBench = nextBench.with(replacedIndex, movingCard);
      } else if (replacedId.startsWith('selfActive')) {
        const replacedIndex = Number(replacedId.replace('selfActive', ''));
        nextActive = nextActive.with(replacedIndex, movingCard);
      }

      // update react state
      setSelfHand(nextHand);
      setSelfActive(nextActive);
      setSelfBench(nextBench);
      setSelected(null);

      playerContext.current = new PlayerContext(nextActive[0], null, nextBench);
      socket.emit(socketEvents.battleUpdate, playerContext.current);
    },
    [selfHand, selfBench, selfActive, selected],
  );
  const endTurnClickHandler = () => {
    console.log('turn end clicked');
  };
  const cancelSearchHandler = () => {
    socket.emit(socketEvents.matchMakeCancel);
    setMatchMakingStatus('battle'); // TEMPORARY!
  };

  if (error) {
    return (
      <>
        <h1>Available Cards</h1>
        <p role="alert">Error: {error}</p>
      </>
    );
  }

  if (matchMakingStatus === 'searching') {
    return <MatchMaking onClickHandler={cancelSearchHandler} />;
  }

  if (matchMakingStatus === 'battle') {
    return (
      <div className="battleArena">
        <CardContainer
          cards={opponentBench}
          selectedCardId={selected?.id}
          id="opponentBench"
        />

        <BattleHistory history={history} />

        <section id="centerStage">
          <CardContainer
            cards={opponentActive}
            selectedCardId={selected?.id}
            registerCardRef={registerCardRef}
            id="opponentActive"
          />
          <img id="arenaIcon" src="battle-arena.jpg" />
          <button
            type="button"
            id="endTurnButton"
            onClick={endTurnClickHandler}
          >
            End Turn
          </button>
          <CardContainer
            cards={selfActive}
            selectedCardId={selected?.id}
            registerCardRef={registerCardRef}
            id="selfActive"
            draggable={true}
            canDrop={true}
            onCardClick={onActiveClickHandler}
            onCardDrop={onCardDrop}
          />
        </section>

        <BattleActionsPanel
          attacks={battleActions}
          selectedCard={selected}
          onClick={onAttackClickHandler}
        />

        <CardContainer
          cards={selfBench}
          id="selfBench"
          selectedCardId={selected?.id}
          registerCardRef={registerCardRef}
          draggable={true}
          canDrop={true}
          onCardClick={onBenchClickHandler}
          onCardDrop={onCardDrop}
        />
        <ScrollableCardContainer
          cards={selfHand}
          selectedCardId={selected?.id}
          id="selfHand"
          visibleCount={8}
          draggable={true}
        />
      </div>
    );
  }
}
