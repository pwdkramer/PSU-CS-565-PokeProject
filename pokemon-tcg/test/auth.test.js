import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import DB, { User } from '../src/database/poke-tcg-db.js';
import express from 'express';
import { installAuth } from '../src/auth.js';

test('registration, credentials, and sessions survive reopening the database', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'poke-auth-'));
  const filename = path.join(directory, 'test.db');
  let db = new DB(filename);
  try {
    const user = db.insertNewUser('trainer', 'password123');
    assert.ok(user instanceof User);
    assert.equal(user.wins, 0);
    assert.equal(db.insertNewUser('trainer', 'password123'), false);
    assert.equal(db.insertNewUser('bad name', 'password123'), false);
    assert.equal(db.insertNewUser('valid', 'short'), false);
    assert.equal(db.validateLogin('trainer', 'wrongpassword'), false);
    assert.equal(db.validateLogin('missing', 'password123'), false);
    assert.equal(db.validateLogin({}, []), false);
    const credential = db.database.prepare('SELECT * FROM credentials').get();
    assert.equal(credential.password, 'password123');
    assert.deepEqual(Object.keys(credential).sort(), ['password', 'user_id']);
    assert.equal(credential.user_id, user.id);
    assert.ok(!db.database.prepare('PRAGMA table_info(users)').all().some((column) => column.name === 'password'));
    const token = db.createSession(user);
    assert.notEqual(db.database.prepare('SELECT token_hash FROM sessions').get().token_hash, token);
    db.database.close();
    db = new DB(filename);
    assert.equal(db.validateLogin('trainer', 'password123').id, user.id);
    assert.equal(db.getSessionUser(token).id, user.id);
    db.database.prepare('UPDATE sessions SET expires_at = 0').run();
    assert.equal(db.getSessionUser(token), null);
    const nextToken = db.createSession(user);
    db.deleteSession(nextToken);
    assert.equal(db.getSessionUser(nextToken), null);
    assert.equal(db.getSessionUser('forged'), null);
  } finally {
    db.database.close();
    rmSync(directory, { recursive: true });
  }
});

test('HTTP registration → session → logout → login, with protected APIs', async () => {
  const db = new DB(':memory:');
  const app = express();
  installAuth(app, db);
  app.get('/api/private', (req, res) => res.json({ payload: req.user }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (endpoint, body, cookie, origin) => fetch(`${base}/api/auth/${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...(origin ? { Origin: origin } : {}) },
    body: JSON.stringify(body),
  });
  try {
    for (const endpoint of ['auth/me', 'private']) {
      assert.equal((await fetch(`${base}/api/${endpoint}`)).status, 401);
    }
    assert.equal((await post('register', { username: 'invalid', password: 'short' })).status, 400);
    assert.equal((await post('register', { username: {}, password: [] })).status, 400);
    assert.equal((await post('register', { username: 'trainer', password: 'password123', confirmPassword: 'different123' })).status, 400);
    assert.equal((await post('register', { username: 'trainer', password: 'password123' })).status, 400);
    assert.equal(db.usernameExists('trainer'), false);
    const response = await post('register', { username: 'trainer', password: 'password123', confirmPassword: 'password123' });
    assert.equal(response.status, 201);
    const user = (await response.json()).payload;
    assert.deepEqual(Object.keys(user).sort(), ['id', 'losses', 'username', 'wins']);
    const cookie = response.headers.get('set-cookie');
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=Strict/i);
    const sessionCookie = cookie.split(';')[0];
    const me = await fetch(`${base}/api/auth/me`, { headers: { Cookie: sessionCookie } });
    assert.equal((await me.json()).payload.id, user.id);
    const privateResponse = await fetch(`${base}/api/private`, { headers: { Cookie: sessionCookie } });
    assert.equal(privateResponse.status, 200);
    assert.equal((await privateResponse.json()).payload.id, user.id);
    assert.equal((await post('register', { username: 'trainer', password: 'password123', confirmPassword: 'password123' })).status, 409);
    assert.equal((await post('logout', {}, sessionCookie, 'https://other.example')).status, 403);
    assert.equal((await post('logout', {}, sessionCookie)).status, 200);
    assert.equal((await fetch(`${base}/api/auth/me`, { headers: { Cookie: sessionCookie } })).status, 401);
    assert.equal((await fetch(`${base}/api/private`, { headers: { Cookie: sessionCookie } })).status, 401);
    assert.equal((await post('login', { username: 'trainer', password: 'incorrect' })).status, 401);
    const login = await post('login', { username: 'trainer', password: 'password123' });
    assert.equal(login.status, 200);
    assert.notEqual(login.headers.get('set-cookie').split(';')[0], sessionCookie);
    const currentCookie = login.headers.get('set-cookie').split(';')[0];
    const secondSession = db.createSession(user);
    const otherUser = db.insertNewUser('other', 'password123');
    const otherSession = db.createSession(otherUser);
    const originalCredential = db.database.prepare('SELECT * FROM credentials WHERE user_id = ?').get(user.id);

    assert.equal((await post('reset-password', { username: 'trainer', password: 'newpassword', confirmPassword: 'different' })).status, 400);
    assert.equal((await post('reset-password', { username: 'trainer', password: 'newpassword' })).status, 400);
    assert.equal((await post('reset-password', { username: 'trainer', password: 'short', confirmPassword: 'short' })).status, 400);
    assert.equal((await post('reset-password', { username: {}, password: [] })).status, 400);
    assert.equal((await post('reset-password', { username: 'missing', password: 'newpassword', confirmPassword: 'newpassword' })).status, 404);
    assert.equal((await post('reset-password', { username: 'trainer', password: 'newpassword', confirmPassword: 'newpassword' }, undefined, 'https://other.example')).status, 403);
    assert.ok(db.validateLogin('trainer', 'password123'));
    assert.ok(db.getSessionUser(secondSession));

    const reset = await post('reset-password', { username: 'trainer', password: 'newpassword', confirmPassword: 'newpassword' });
    assert.equal(reset.status, 200);
    assert.equal(reset.headers.get('set-cookie'), null);
    assert.equal((await fetch(`${base}/api/auth/me`, { headers: { Cookie: currentCookie } })).status, 401);
    assert.equal(db.getSessionUser(secondSession), null);
    assert.equal(db.getSessionUser(otherSession).id, otherUser.id);
    assert.equal((await post('login', { username: 'trainer', password: 'password123' })).status, 401);
    const newLogin = await post('login', { username: 'trainer', password: 'newpassword' });
    assert.equal(newLogin.status, 200);
    assert.deepEqual((await newLogin.json()).payload, user);
    const updatedCredential = db.database.prepare('SELECT * FROM credentials WHERE user_id = ?').get(user.id);
    assert.notEqual(updatedCredential.password, originalCredential.password);
    assert.equal(updatedCredential.password, 'newpassword');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    db.database.close();
  }
});
