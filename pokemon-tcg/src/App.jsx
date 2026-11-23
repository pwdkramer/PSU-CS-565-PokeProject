import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './components/Main';
import Homepage from './components/Homepage';
import Cardview from './components/Cardview';
import Deckbuild from './components/Deckbuild';
import BattleArena from './components/BattleArena';
import { buildRawCard } from './types/rawCard.js'
import './App.css';




// internal routes sent to server.js
const getEndpoint = (dataType) => {
  switch (dataType) {
    case 'cardimgs':
      return '/api/cardimgs';
    case 'deckbuild':
      return '/api/deck';
    case 'battleArena':
      return '/api/battle';
  }
};

const parseData = function parseAnyRawHttpData(dataType, data) {
  if (dataType === 'battleArena') {
    const ret = {};
    Object.entries(data).forEach(([key, cards]) => {
      console.log(key, cards);
      ret[key] = cards.map((card) => {
        return buildRawCard(card);
      })
    })

    return ret;
  }

  return data;
}

// main data loader. If an error occurs, then it sets the error attribute to
// indicate to the react page, else set data attribute
const fetchCards = async function fetchCards(dataType) {
  try {
    const endpoint = getEndpoint(dataType);
    const response = await fetch(endpoint);
    const rawdata = await response.json();
    
    if (!response.ok) {
      return {
        data: null,
        error: rawdata.payload,
      };
    }

    const data = parseData(dataType, rawdata.payload);

    return {
      data: data,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: `${err}`,
    };
  }
};

// reactrouter's way of handling routes. See https://reactrouter.com/start/data/routing
// loaders get called by react framework when page requested
const router = createBrowserRouter([
  {
    path: '/',
    Component: Main,
    children: [
      {
        index: true,
        Component: Homepage,
      },
      {
        path: 'cardview',
        Component: Cardview,
        loader: () => fetchCards('cardimgs'),
        // this is supposed to render during loading events.
        // See https://reactrouter.com/start/framework/route-module#hydratefallback
        HydrateFallback: () => {
          return <p role="status">Loading Cardview Route ...</p>;
        },
      },
      {
        path: 'deckbuild',
        Component: Deckbuild,
        loader: () => fetchCards('deckbuild'),
        // this is supposed to render during loading events.
        // See https://reactrouter.com/start/framework/route-module#hydratefallback
        HydrateFallback: () => {
          return <p role="status">Loading Cardview Route ...</p>;
        },
      },
      {
        path: 'battleArena',
        Component: BattleArena,
        loader: () => fetchCards('battleArena'),
        // this is supposed to render during loading events.
        // See https://reactrouter.com/start/framework/route-module#hydratefallback
        HydrateFallback: () => {
          return <p role="status">Loading Battle Arena ...</p>;
        },
      },
    ],
  },
]);

// this is what is actuall exported to main.jsx
export default function App() {
  return <RouterProvider router={router} />;
}
