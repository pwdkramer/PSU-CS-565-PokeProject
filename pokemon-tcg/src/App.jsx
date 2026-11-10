import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './components/Main';
import Deckpage from './components/Deckpage';
import './App.css';

// internal routes sent to server.js
const getEndpoint = (dataType) => {
  switch (dataType) {
    case 'cardimgs':
      return '/api/cardimgs';
  }
};

// main data loader. If an error occurs, then it sets the error attribute to
// indicate to the react page, else set data attribute
const fetchCards = async function fetchCards(dataType) {
  try {
    const endpoint = getEndpoint(dataType);
    console.log(`${endpoint}`);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(`payload: ${data.payload}`);
    console.log(data.payload[0]);

    if (!response.ok) {
      return {
        data: null,
        error: data.payload,
      };
    }

    return {
      data: data.payload,
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
        Component: Deckpage,
        loader: () => fetchCards('cardimgs'),
        // this is supposed to render during loading events.
        // See https://reactrouter.com/start/framework/route-module#hydratefallback
        HydrateFallback: () => {
          return <p role="status">Loading Home Route ...</p>;
        },
      },
      /*{
        path: 'deckbuild',
        Component: Countries,
        loader: () => fetchCountries('countries'),
        HydrateFallback: () => {
          return <p role="status">Loading Countries Route ...</p>;
        },
      },
      {
        path: 'battle',
        Component: Populations,
        loader: () => fetchCountries('populous'),
        HydrateFallback: () => {
          return <p role="status">Loading Populous Route ...</p>;
        },
      },*/
    ],
  },
]);

// this is what is actuall exported to main.jsx
export default function App() {
  return <RouterProvider router={router} />;
}
