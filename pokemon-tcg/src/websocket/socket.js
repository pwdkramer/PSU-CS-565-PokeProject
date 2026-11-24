import { io } from 'socket.io-client';

// https://socket.io/how-to/use-with-react
const URL =
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5001';
const socket = io(URL);
// note, both 'production' and the else, should work if using npm run runprod bc
// it builds via Vite instead of using vite server

export default socket;
