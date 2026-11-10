import { useLoaderData } from 'react-router-dom';
import CardContainer from './CardContainer';

export default function Deckpage() {
  const { data, error } = useLoaderData();
  console.log(data);
  if (error) {
    return (
      <>
        <h1>Countries</h1>
        <p role="alert">Error: {error}</p>
      </>
    );
  }

  return (
    <>
      <CardContainer cards={data} />
    </>
  );
}
