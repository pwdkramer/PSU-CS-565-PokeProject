// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const shuffle = async function fisherYatersShuffleAlg(
  toShuffle,
  enforceRules = false,
) {
  // bc of the indice swapping, I left this as a standard for loop rather than array method
  // enforce rules ensures that at least one basic card is in the top 7 cards

  const out = [...toShuffle];
  const count = out.length;
  let passedChecks = false;
  let loopCtr = 0;

  while (!passedChecks) {
    for (let i = count - 1; i > 0; --i) {
      const rand = Math.floor(Math.random() * (i + 1));
      const temp = out[rand];
      out[rand] = out[i];
      out[i] = temp;
    }

    // one of the first 7 cards must be a basic pokemon type
    if (enforceRules) {
      const firstSeven = out.slice(0, 7);
      firstSeven.forEach((card) => {
        if (card.category === 'Pokemon') {
          if (card.stage === 'Basic') {
            passedChecks = true;
          }
        }
      });
    } else {
      passedChecks = true;
    }

    loopCtr += 1;
  }

  return [loopCtr, out];
};

export default shuffle;
