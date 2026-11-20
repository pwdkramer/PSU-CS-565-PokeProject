import { useLoaderData } from 'react-router-dom';
import { useRef, useState } from 'react';
import CardContainer from './CardContainer';

export default function Deckbuild() {
  const { data, error } = useLoaderData();
  const [search, setSearch] = useState('');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const query = search.trim().toLowerCase();
  const visibleCards = (data ?? []).filter(function (card) {
    const name = card.name.toLowerCase();
    const matches = name.includes(query);
    return matches;
  });

  const [deck, setDeck] = useState([]);
  const nextCopyId = useRef(0);

  function addCardToDeck(card) {
    const newCard = { ...card, copyId: nextCopyId.current++ };
    setDeck((currentDeck) => [...currentDeck, newCard]);
  }

  function removeCardFromDeck(card) {
    setDeck((currentDeck) =>
      currentDeck.filter((c) => c.copyId !== card.copyId)
    );
  }

  return (
    <>
      <h1>Deck Builder</h1>

      <div className="deck-builder-layout">
        <section className="deck-builder-panel">
          <h2>Available Cards</h2>

          <label htmlFor="card-search">Search by card name: </label>
          <input
            id="card-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="deck-builder-results">
            <CardContainer
              cards={visibleCards}
              onCardClick={addCardToDeck}
              actionLabel="Add"
            />
          </div>
          
        </section>

        <section className="deck-builder-panel">
          <h2>Your deck</h2>
          <p>Deck must contain 60 cards</p>
          <p>Include at least one basic Pokemon</p>
          <p>Max of 4 copies of any card (excluding energy cards)</p>
          <div className="deck-builder-contents">
            <CardContainer
              cards={deck}
              onCardClick={removeCardFromDeck}
              actionLabel="Remove"
            />
          </div>
        </section>
      </div>
    </>
  );
}