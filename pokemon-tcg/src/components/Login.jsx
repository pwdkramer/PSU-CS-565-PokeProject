import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const registering = mode === 'register';
  const resetting = mode === 'reset-password';
  const newPassword = registering || resetting;

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setMessage('');
  }

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError('');
    setMessage('');
    if (newPassword && form.get('password') !== form.get('confirmPassword')) {
      setError('Passwords do not match.');
      event.currentTarget.elements.confirmPassword.focus();
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.get('username').trim(),
          password: form.get('password'),
          ...(newPassword ? { confirmPassword: form.get('confirmPassword') } : {}),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.payload);
      if (resetting) {
        setMode('login');
        setMessage(result.payload);
      } else {
        navigate('/home', { replace: true });
      }
    } catch (err) {
      setError(err instanceof TypeError ? 'Unable to connect. Please try again.' : err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <h1>PokeProject Battle Arena</h1>
      <section className="auth-panel" aria-labelledby="auth-heading">
        <h2 id="auth-heading">{registering ? 'Create an account' : resetting ? 'Reset password' : 'Log in'}</h2>
        <p>{registering ? 'Choose your trainer name to get started.' : resetting ? 'Enter your username and choose a new password.' : 'Welcome back, trainer.'}</p>
        {message && <p role="status">{message}</p>}
        <form onSubmit={submit} key={mode}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" required
            minLength={registering ? 3 : undefined} maxLength={24}
            pattern={registering ? '[A-Za-z0-9_]{3,24}' : undefined}
            aria-describedby={registering ? 'username-help' : undefined} disabled={pending} />
          {registering && <p id="username-help" className="field-help">3–24 letters, numbers, or underscores. Case-sensitive.</p>}
          <label htmlFor="password">{resetting ? 'New password' : 'Password'}</label>
          <input id="password" name="password" type="password" required maxLength={128}
            minLength={newPassword ? 8 : undefined} autoComplete={newPassword ? 'new-password' : 'current-password'}
            aria-describedby={newPassword ? 'password-help' : undefined} disabled={pending} />
          {newPassword && <p id="password-help" className="field-help">8–128 characters.</p>}
          {newPassword && <>
            <label htmlFor="confirmPassword">Confirm {resetting ? 'new password' : 'password'}</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required
              minLength={8} maxLength={128} autoComplete="new-password" disabled={pending} />
          </>}
          {error && <p role="alert" className="form-error">{error}</p>}
          <button className="arena-button" type="submit" disabled={pending}>
            {pending ? 'Please wait…' : registering ? 'Create account' : resetting ? 'Reset password' : 'Log in'}
          </button>
        </form>
        <div className="auth-actions">
          {mode === 'login' ? <>
            <button className="text-button" type="button" disabled={pending} onClick={() => changeMode('register')}>New here? Create an account</button>
            <button className="text-button" type="button" disabled={pending} onClick={() => changeMode('reset-password')}>Forgot password?</button>
          </> : <button className="text-button" type="button" disabled={pending} onClick={() => changeMode('login')}>Back to log in</button>}
        </div>
      </section>
    </main>
  );
}
