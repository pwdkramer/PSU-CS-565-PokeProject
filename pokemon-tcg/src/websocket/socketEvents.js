const socketEvents = Object.freeze({
  helloWorld: 'hello world',
  matchMakeRequest: 'match make request',
  matchMakeCancel: 'match make cancel',
  matchStart: 'match start',
  battleStart: 'batte start',
  battleUpdate: 'battle update',
  contextUpdate: 'context update',
  turnEnd: 'turn end',
  yourTurn: 'your turn',
});

export default socketEvents;
