import { useLoaderData } from 'react-router-dom';

export default function Deckbuild() {
  const { data, error } = useLoaderData();
  console.log(data);

  return (
    <h1>Deck Builder</h1>
  );
}