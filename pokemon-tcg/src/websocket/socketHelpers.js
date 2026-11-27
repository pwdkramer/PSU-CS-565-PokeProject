export const getRoomMembers = async function returnAllSocketsInTheGivenRoom(
  io,
  roomName,
) {
  const sockets = await io.in(roomName).fetchSockets();

  //sockets.forEach((socket) => {
  //  console.log(socket, socket.id, socket.data);
  //})

  return sockets;
};

export const getRoom = function getCurrentRoomOfSocket(socket) {
  // socket.rooms is a set and contains the socket.id and the room id
  return [...socket.rooms].find((room) => room !== socket.id);
};

export const getBattle = function getBattleIdAndGameContext(socket) {
  const battleId = getRoom(socket);
  const gameContext = ACTIVEBATTLES.get(battleId);

  return [battleId, gameContext];
};
