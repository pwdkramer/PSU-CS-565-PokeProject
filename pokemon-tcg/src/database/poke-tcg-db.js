import { DatabaseSync } from 'node:sqlite';
import { randomBytes, createHash } from 'node:crypto';

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export const DECKSIZE = 60;

export class User {
  id;
  username;
  wins;
  losses;

  constructor(id, username, wins, losses) {
    this.id = id;
    this.username = username;
    this.wins = wins;
    this.losses = losses;
  }
}

export class Decks {
  deck1 = [];
  deck2 = [];
  deck3 = [];

  constructor(deck1 = [], deck2 = [], deck3 = []) {
    if (!Array.isArray(deck1)) this.deck1 = JSON.parse(deck1);
    else {
      this.deck1 = deck1;
    }

    if (!Array.isArray(deck2)) this.deck2 = JSON.parse(deck2);
    else {
      this.deck2 = deck2;
    }

    if (!Array.isArray(deck3)) this.deck3 = JSON.parse(deck3);
    else {
      this.deck3 = deck3;
    }
  }
}

export default class DB {
  database;

  constructor(filename = 'pokemon-tcg.db') {
    this.database = new DatabaseSync(filename);
    this.database.exec('PRAGMA foreign_keys = ON');

    this.database.exec(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, wins INTEGER NOT NULL, losses INTEGER NOT NULL)',
    );

    this.database.exec(`
      CREATE TABLE IF NOT EXISTS credentials (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        password TEXT
      );
      CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
      );
    `);

    // decks table, columsn: id (does not auto increment - pivot on users->id), decks1 ,2 ,3 which will be card ids JSON.stringify-ied
    this.database.exec(
      'CREATE TABLE IF NOT EXISTS decks (id INT PRIMARY KEY NOT NULL, deck1 TEXT, deck2 TEXT, deck3 TEXT)',
    );
  }

  isValidPassword(password) {
    return typeof password === 'string' && password.length >= 8 && password.length <= 128;
  }

  isValidUsername(username) {
    return typeof username === 'string' && /^[A-Za-z0-9_]{3,24}$/.test(username);
  }

  usernameExists(username) {
    const ret = this.database
      .prepare('SELECT COUNT(*) as count FROM users WHERE username=?')
      .get(username); // returns object {count: <int> }
    return Boolean(ret.count);
  }

  validateLogin(username, password) {
    if (!this.isValidUsername(username) || typeof password !== 'string' || password.length > 128) {
      // then one of username or password is null / undefined
      return false;
    }

    const ret = this.database
      .prepare('SELECT users.*, credentials.password FROM users JOIN credentials ON user_id = users.id WHERE username=?')
      .get(username);

    if (!ret || ret.password !== password) {
      return false;
    }

    return new User(ret.id, ret.username, ret.wins, ret.losses);
  }

  insertNewUser(username, password) {
    if (this.isValidUsername(username) && this.isValidPassword(password)) {
      if (this.usernameExists(username)) {
        return false;
      }

      this.database.exec('BEGIN');
      try {
        const res = this.database
        .prepare(
          'INSERT INTO users (username, wins, losses) VALUES (?, 0, 0)',
        )
        .run(username);
        this.database.prepare('INSERT INTO credentials (user_id, password) VALUES (?, ?)')
          .run(res.lastInsertRowid, password);
        this.database.exec('COMMIT');
        return new User(res.lastInsertRowid, username, 0, 0);
      } catch (error) {
        this.database.exec('ROLLBACK');
        throw error;
      }
    }

    return false;
  }

  resetPassword(username, password) {
    if (!this.isValidUsername(username) || !this.isValidPassword(password)) return false;
    const user = this.database.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (!user) return false;
    this.database.exec('BEGIN');
    try {
      const result = this.database.prepare('UPDATE credentials SET password = ? WHERE user_id = ?')
        .run(password, user.id);
      if (result.changes !== 1) {
        this.database.exec('ROLLBACK');
        return false;
      }
      this.database.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);
      this.database.exec('COMMIT');
      return true;
    } catch (error) {
      this.database.exec('ROLLBACK');
      throw error;
    }
  }

  createSession(user) {
    this.database.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
    const token = randomBytes(32).toString('hex');
    this.database.prepare('INSERT INTO sessions VALUES (?, ?, ?)')
      .run(hashToken(token), user.id, Date.now() + 24 * 60 * 60 * 1000);
    return token;
  }

  getSessionUser(token) {
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
    const user = this.database.prepare(`SELECT users.* FROM users JOIN sessions ON users.id = sessions.user_id
      WHERE token_hash = ? AND expires_at > ?`).get(hashToken(token), Date.now());
    return user ? new User(user.id, user.username, user.wins, user.losses) : null;
  }

  deleteSession(token) {
    if (typeof token === 'string') this.database.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
  }

  updateDeck(user, deckIndex, deck) {
    // user is User instance,
    // deckIndex should be 1 | 2 | 3
    // deck should be array of card ids

    if (deckIndex <= 0 || deckIndex > 3) {
      return false;
    }

    const deckString = `deck${deckIndex}`;
    const deckData = JSON.stringify(deck);
    const deckUpsert = {
      id: user.id,
      deck1: null,
      deck2: null,
      deck3: null,
    };
    deckUpsert[deckString] = deckData;

    // upsert: if id DNE then insert this deck and nulls for the others
    // updated: if id DE then update only non-null deck from deckUpsert obj using COALESCE
    const upsert = this.database
      .prepare(
        `INSERT INTO decks (id, deck1, deck2, deck3) VALUES (:id, :deck1, :deck2, :deck3) 
        ON CONFLICT(id) DO UPDATE SET 
          deck1 = COALESCE(excluded.deck1, decks.deck1),
          deck2 = COALESCE(excluded.deck2, decks.deck2),
          deck3 = COALESCE(excluded.deck3, decks.deck3)`,
      )
      .run(deckUpsert);

    return upsert.changes === 1;
  }

  getDecks(user) {
    // user is a User instance
    const { id, username } = user;

    if (this.usernameExists(username)) {
      const ret = this.database
        .prepare('SELECT deck1, deck2, deck3 FROM decks WHERE id = ?')
        .get(id);
      if (ret) {
        const { deck1, deck2, deck3 } = ret;
        return new Decks(deck1, deck2, deck3);
      }
    }

    return new Decks();
  }
}
