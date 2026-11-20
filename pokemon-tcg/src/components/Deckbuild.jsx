import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';
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
            <CardContainer cards={visibleCards} />
          </div>
          
        </section>

        <section className="deck-builder-panel">
          <h2>Your deck</h2>
          <p>Include at least one basic Pokemon. Max of 4x of each card excluding energy cards.</p>
          <div className="deck-builder-contents">
            {/* Your deck content goes here */}
          </div>
        </section>
      </div>
    </>
  );
}