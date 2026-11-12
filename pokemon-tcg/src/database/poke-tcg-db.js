import { DatabaseSync } from 'node:sqlite';

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

  constructor() {
    this.database = new Database('pokemon-tcg.db');

    this.database.exec(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, wins INTEGER NOT NULL, losses INTEGER NOT NULL)',
    );

    // decks table, columsn: id (does not auto increment - pivot on users->id), decks1 ,2 ,3 which will be card ids JSON.stringify-ied
    this.database.exec(
      'CREATE TABLE IF NOT EXISTS decks (id INT PRIMARY KEY NOT NULL, deck1 TEXT, deck2 TEXT, deck3 TEXT)',
    );
  }

  isValidPassword(password) {
    // needs more?
    return password.length > 0;
  }

  isValidUsername(username) {
    // needs more?
    return username.length > 0;
  }

  usernameExists(username) {
    const ret = this.database
      .prepare('SELECT COUNT * as count FROM users WHERE username=?')
      .get(username); // returns object {count: <int> }
    return Boolean(ret.count);
  }

  validateLogin(username, password) {
    if (!username || !password) {
      // then one of username or password is null / undefined
      return false;
    }

    const ret = this.database
      .prepare('SELECT * FROM users WHERE username=?')
      .get(username);

    if (!ret) {
      // then username not in db
      return false;
    }

    const { id, wins, losses } = ret;

    if (password !== password) {
      return false;
    }

    return new User(id, username, wins, losses);
  }

  insertNewUser(username, password) {
    if (isValidUsername(username) && isValidPassword(password)) {
      if (usernameExists(username)) {
        return false;
      }

      const res = this.database
        .prepare(
          'INSERT INTO users (username, password, wins, losses) VALUES (?, ?, 0, 0)',
        )
        .run(username, password);
      return res.changes === 0
        ? false
        : new User(res.lastInsertRowid, username, 0, 0);
    }

    return false;
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

    if (usernameExists(username)) {
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
