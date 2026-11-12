import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import database, { User, Decks } from './database/poke-tcg-db.js';
import buildRawCard from './types/RawCard.js';

// footer reference: <a target="_blank" href="https://icons8.com/icon/8gTxcIoC22Bp/pokemonball">Pokemonball</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a target="_blank" href="https://icons8.com/icon/45657/up-arrow">Up Arrow</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a target="_blank" href="https://icons8.com/icon/1X9wUcuHxlS2/pokemon-pointer">Pokemon Pointer</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a href="https://www.flaticon.com/free-icons/pokemon" title="pokemon icons">Pokemon icons created by Those Icons - Flaticon</a>

// turns our ES6 does not natively support __dirname so:
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5001;

const Endpoint = 'https://api.tcgdex.net/v2/en';

// cached http response data:
let SET = null;
let CARDS = null;

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
  const path = `${Endpoint}/cards/${id}`;

  // ToDO: add retries!

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = await response.json();
  return buildRawCard(json);
};

const getCards = async function getCardsFromSetData() {
  if (CARDS) {
    return CARDS;
  }

  const set = await getSet();
  const cardData = await Promise.all(set.map((card) => getCard(card.id)));

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
    const cards = await getCards();
    console.log(cards);
    return res.status(200).json({
      payload: cards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      payload: `Failed to get card data: ${error}`,
    });
  }
});

// serve static files in dist dir such as favicon.svg, assets/index.js, assets/index.css
app.use(express.static(path.join(__dirname, '..', 'dist')));

// everything else gets the exact same dist/index.html file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
