import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import socketEvents from './websocket/socketEvents.js';
import { randomUUID } from 'crypto';
import database, { User, Decks } from './database/poke-tcg-db.js';
import shuffle from './helpers/shuffle.js';
import { GameContext, PlayerContext } from './types/gameContext.js';
import { randGenInt } from './helpers/randGen.js';

// footer reference: <a target="_blank" href="https://icons8.com/icon/8gTxcIoC22Bp/pokemonball">Pokemonball</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a target="_blank" href="https://icons8.com/icon/45657/up-arrow">Up Arrow</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a target="_blank" href="https://icons8.com/icon/1X9wUcuHxlS2/pokemon-pointer">Pokemon Pointer</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a href="https://www.flaticon.com/free-icons/pokemon" title="pokemon icons">Pokemon icons created by Those Icons - Flaticon</a>

// turns our ES6 does not natively support __dirname so:
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5001;

const Endpoint = 'https://api.tcgdex.net/v2/en';

// cached http response data:
let SET = null;
let CARDS = null;
const ACTIVEBATTLES = new Map();
const WAITINGROOM = 'waiting room';

const getSet = async function getSetDataOnly() {
  if (SET) {
    // already cached
    return SET;
  }

  const response = await fetch(`${Endpoint}/sets/base1`);
  if (!response.ok) {
    throw new Error(
      `HTTP Status Code: ${response.status} - ${response.statusText}`,
    );
  }

  const json = await response.json();
  const total = json.cardCount.total;

  if (json.cards.length !== total) {
    throw new Error(`Expected ${total} cards, received ${json.cards.length}`);
  }

  SET = json.cards;

  return SET;
};

const getCard = async function getSingleCard(id) {
  // gets a full card data object, not the sets summary
  const path = `${Endpoint}/cards/${id}`;

  // ToDO: add retries!

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = await response.json();

  return json;
};

const getCards = async function getCardsFromSetData() {
  if (CARDS) {
    return CARDS;
  }

  const set = await getSet();
  const cardData = await Promise.all(set.map((card) => getCard(card.id)));

  // reponse has evolveFrom: string, so add the evolveFromId element which is the card.id which matches that evolveFrom string
  cardData.forEach((card) => {
    if (card.category === 'Pokemon') {
      if (card.stage && card.stage !== 'Stage0') {
        cardData.some((evalcard) => {
          const { id, name } = evalcard;
          if (name === card.name) {
            card['evolveFromId'] = id;
            return true; // early exit
          }
          return false;
        });
      }
    }
  });
  CARDS = cardData;

  return CARDS;
};

app.get('/api/cardimgs', async (req, res) => {
  try {
    const set = await getSet();

    return res.status(200).json({
      payload: set,
    });
  } catch (error) {
    return res.status(500).json({
      payload: `Failed to get cardimgs: ${error}`,
    });
  }
});

app.get('/api/deck', async (req, res) => {
  try {
    const cards = await getSet();

    return res.status(200).json({
      payload: cards,
    });
  } catch (error) {
    return res.status(500).json({
      payload: `Failed to get card data: ${error}`,
    });
  }
});

app.get('/api/battle', async (req, res) => {
  try {
    const cards = await getCards();

    return res.status(200).json({
      payload: cards.slice(0, 60),
    });
  } catch (error) {
    return res.status(500).json({
      payload: `Failed to get card data: ${error}`,
    });
  }
});

app.get('/api/Cardback/*extra', async (req, res) => {
  // this is because the card system wants to put the /high.webp end on it, so lets fool it
  // will force the browser to render the back of the card via the express.static middleware below
  return res.redirect('/Cardback.jpg');
});

// serve static files in dist dir such as favicon.svg, assets/index.js, assets/index.css
app.use(express.static(path.join(__dirname, '..', 'dist')));

// everything else gets the exact same dist/index.html file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const getRoomMembers = async function returnAllSocketsInTheGivenRoom(roomName) {
  const sockets = await io.in(roomName).fetchSockets();

  //sockets.forEach((socket) => {
  //  console.log(socket, socket.id, socket.data);
  //})

  return sockets;
};

const getRoom = function getCurrentRoomOfSocket(socket) {
  // socket.rooms is a set and contains the socket.id and the room id
  return [...socket.rooms].find((room) => room !== socket.id);
};

const getBattle = function getBattleIdAndGameContext(socket) {
  const battleId = getRoom(socket);
  const gameContext = ACTIVEBATTLES.get(battleId);

  return [battleId, gameContext];
};

io.on('connection', (socket) => {
  console.log(`${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnect`);
    socket.rooms.forEach((roomName) => socket.leave(roomName));
  });
  socket.on(socketEvents.helloWorld, (msg) => {
    console.log('hello world received');
    console.log(msg);
  });
  socket.on(socketEvents.matchMakeRequest, async () => {
    const members = await getRoomMembers(WAITINGROOM);

    if (members.length > 0) {
      const [_shuffleCount, shuffled] = await shuffle(members);
      const opponent = shuffled[0];

      socket.leave(WAITINGROOM);
      opponent.leave(WAITINGROOM);

      const battleId = randomUUID();
      const gameContext = new GameContext(0, 'active', socket.id, opponent.id);
      ACTIVEBATTLES.set(battleId, gameContext);

      socket.join(battleId);
      opponent.join(battleId);

      // broadcast to room
      io.to(battleId).emit(socketEvents.matchStart);
    } else {
      socket.join(WAITINGROOM);
    }
  });
  socket.on(socketEvents.matchMakeCancel, async (ms) => {
    socket.leave(WAITINGROOM);
    const members = await getRoomMembers();
  });
  socket.on(socketEvents.battleUpdate, (playerContext) => {
    const [battleId, gameContext] = getBattle(socket);
    if (!battleId) return;
    if (!gameContext) return;

    const playerContextObj = PlayerContext.copy(playerContext); // so methods are available
    gameContext.setPlayerContext(socket.id, playerContextObj);
    ACTIVEBATTLES.set(battleId, gameContext); // store actual state

    const payload =
      gameContext.turn < 2 ? playerContextObj.obfuscate() : playerContextObj;
    socket.to(battleId).emit(socketEvents.contextUpdate, payload); // broadcast to room except for self
  });
  socket.on(socketEvents.turnEnd, async (playerContext) => {
    const [battleId, gameContext] = getBattle(socket);
    if (!battleId) return;
    if (!gameContext) return;

    const newTurn = gameContext.incrementTurn();

    if (newTurn === 2) {
      // then prelim is over, time to start battle
      gameContext.randomizeTurn();

      // signal that the prelim stage is over and to
      // update cards of other player with non-obfuscated versions
      io.to(gameContext.member1Name).emit(
        socketEvents.battleStart,
        gameContext.member2Data,
      );
      io.to(gameContext.member2Name).emit(
        socketEvents.battleStart,
        gameContext.member1Data,
      );
    }

    ACTIVEBATTLES.set(battleId, gameContext); // store state

    if (newTurn >= 2) {
      io.to(gameContext.currentPlayer).emit(socketEvents.yourTurn, true);
      io.to(gameContext.nextPlayer).emit(socketEvents.yourTurn, false);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
