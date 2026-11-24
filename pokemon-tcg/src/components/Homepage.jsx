import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <section className="home-page">
      <h1>Welcome to the Arena</h1>
      <p>Browse the cards or start planning your next deck.</p>
      <div className="home-links">
        <Link className="arena-button" to="/cardview">Browse cards</Link>
        <Link className="arena-button" to="/deckbuild">Deck builder</Link>
      </div>
    </section>
  );
}
