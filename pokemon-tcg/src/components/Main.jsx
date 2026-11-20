import { useState } from 'react';
import { NavLink, Outlet, useLoaderData, useNavigate } from 'react-router-dom';

export default function Main() {
  const user = useLoaderData();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Unable to log out. Please try again.');
      navigate('/', { replace: true });
    } catch {
      setError('Unable to log out. Please try again.');
    } finally {
      setPending(false);
    }
  }
  return (
    <main>
      <header className="arena-header">
        <span>PokeProject Battle Arena</span>
        <span>{user.username}</span>
        <details className="nav-dropdown" onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
        }} onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.currentTarget.open = false;
            event.currentTarget.querySelector('summary').focus();
          }
        }}>
          <summary className="arena-button">Menu</summary>
          <nav className="nav-dropdown-links" aria-label="Main navigation">
            <NavLink to="/home" onClick={(event) => { event.currentTarget.closest('details').open = false; }}>Home</NavLink>
            <NavLink to="/cardview" onClick={(event) => { event.currentTarget.closest('details').open = false; }}>Cards</NavLink>
            <NavLink to="/deckbuild" onClick={(event) => { event.currentTarget.closest('details').open = false; }}>Deck builder</NavLink>
            <button className="text-button" onClick={logout} disabled={pending}>{pending ? 'Logging out…' : 'Log out'}</button>
          </nav>
        </details>
      </header>
      {error && <p role="alert">{error}</p>}
      <Outlet />
    </main>
  );
}
