import { useRouteError, isRouteErrorResponse } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Route Error Occured</h1>
        <h3>{error.status} {error.statusText}</h3>
        <p>{error.data?.message}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>An Unexpected Error Has Occured</h1>
      <p>{error instanceof Error ? error.message : 'Unknown Error'}</p>
    </div>
  )
}