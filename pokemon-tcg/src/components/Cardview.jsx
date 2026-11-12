import { useLoaderData } from 'react-router-dom';
import CardContainer from './CardContainer';

export default function Cardview() {
  const { data, error } = useLoaderData();
  console.log(data);
  if (error) {
    return (
      <>
        <h1>Available Cards</h1>
        <p role="alert">Error: {error}</p>
      </>
    );
  }

  return (
    <>
      <h1>Available Cards</h1>
      <CardContainer cards={data} />
    </>
  );
}
