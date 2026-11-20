import { redirect } from 'react-router-dom';

export async function requireUser() {
  const response = await fetch('/api/auth/me');
  if (response.status === 401) throw redirect('/');
  if (!response.ok) throw new Error('Unable to check your session. Please reload.');
  return (await response.json()).payload;
}

export async function loginLoader() {
  const response = await fetch('/api/auth/me');
  if (response.ok) return redirect('/home');
  if (response.status !== 401) throw new Error('Unable to check your session. Please reload.');
  return null;
}
