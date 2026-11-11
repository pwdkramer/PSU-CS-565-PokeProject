import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import database, { User, Decks } from './database/poke-tcg-db';

// footer reference: <a target="_blank" href="https://icons8.com/icon/8gTxcIoC22Bp/pokemonball">Pokemonball</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a target="_blank" href="https://icons8.com/icon/45657/up-arrow">Up Arrow</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a target="_blank" href="https://icons8.com/icon/1X9wUcuHxlS2/pokemon-pointer">Pokemon Pointer</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a href="https://www.flaticon.com/free-icons/pokemon" title="pokemon icons">Pokemon icons created by Those Icons - Flaticon</a>

// turns our ES6 does not natively support __dirname so:
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5001;

const Endpoint = 'https://api.tcgdex.net/v2/en';

app.get('/api/cardimgs', async (req, res) => {
  console.log('into get cardimgs');
  try {
    const response = await fetch(`${Endpoint}/sets/base1`);
    if (!response.ok) {
      throw new Error(
        `HTTP Status Code: ${response.status} - ${response.statusText}`
      );
    }

    const json = await response.json();
    const total = json.cardCount.total;
    const cards = json.cards;

    console.log(cards);

    if (cards.length === total) {
      return res.status(200).json({
        payload: cards,
      });
    }

    throw new Error(`Expected ${total} cards, received ${cads.length}`);
  } catch (error) {
    return res.status(500).json({
      payload: `Failed to get cardimgs: ${error}`,
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
