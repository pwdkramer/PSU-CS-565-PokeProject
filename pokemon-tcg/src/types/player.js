import { cardGroups, filterTypes } from './actions.js';
import { RawPokemonCard, RawTrainerCard, RawEnergyCard } from './rawCard.js';

export default class Player {
  active = null; // active pokemon card
  bench = []; // cards on the bench, max 5
  hand = []; // cards in hand
  deck = []; // cards in deck (to be drawn)
  discard = []; // cards in discard pile

  constructor({
    active = null,
    bench = [],
    hand = [],
    deck = [],
    discard = [],
  }) {
    this.active = active;
    this.bench = bench;
    this.hand = hand;
    this.deck = deck;
    this.discard = discard;
  }

  getActiveCard() {
    return this.active;
  }

  getDeck(type) {
    switch (type) {
      case cardGroups.bench:
        return this.bench;
      case cardGroups.hand:
        return this.hand;
      case cardGroups.deck:
        return this.deck;
      case cardGroups.discard:
        return this.discard;
      case cardGroups.deckPlusHand:
        return [...this.deck, ...this.hand];
      case cardGroups.benchPlusActive:
        return [this.active, ...this.bench];
      case cardGroups.active:
        reutrn[this.active];
      default:
        throw new Error(
          `valid type for Player.getCardCount = ${cardGroups.bench} | ${cardGroups.hand} | ${cardGroups.deck} | ${cardGroups.discard}; received: ${type}`,
        );
    }
  }

  getCardCount(type = cardGroups.hand) {
    return this.getDeck(type).length;
  }

  getEvolvedCards() {
    // return all cards that are above base evolution level in bench + active
    const evolved = [];
    if (this.active?.isEvolved()) evolved.push(this.active);

    this.bench.forEach((card) => {
      if (card?.isEvolved()) evolved.push(card);
    });

    return evolved;
  }

  countTypeInDeck(filterType, cardGroup) {
    let cardType = RawTrainerCard;
    if (filterType === filterTypes.energy) {
      cardType = RawEnergyCard;
    } else if (
      filterType === filterTypes.anyPokemon ||
      filterType === filterTypes.basicPokemon
    ) {
      cardType = RawPokemonCard;
    } else {
      return 0;
    }

    const curDeck = this.getDeck(cardGroup);

    return (
      curDeck?.reduce((accumulator, card) => {
        if (
          filterType === filterTypes.basicPokemon &&
          card instanceof cardType
        ) {
          return accumulator + Number(card.getStage() === 0);
        }
        return accumulator + Number(card instanceof cardType);
      }, 0) ?? 0
    );
  }

  sumActiveAttachements() {
    const sum = this.active.getAttachedEnergy().length;
    return this.bench.reduce((accumulator, card) => {
      return accumulator + card.getAttachedEnergy().length;
    }, sum);
  }
}
