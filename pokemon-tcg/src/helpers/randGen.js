export const randGenInt = function randomIntGeneratorBetweenInclusive(
  lower = 0,
  upper = 1,
) {
  const number = Math.floor(Math.random() * (upper - lower + 1)) + lower;
  return number;
};
