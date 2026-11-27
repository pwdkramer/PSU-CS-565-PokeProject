import { randGenInt } from '../helpers/randGen.js';

export class PlayerContext {
  attacker = null;
  bench = [];

  constructor(attacker, bench) {
    this.attacker = attacker ?? null;
    this.bench = bench ?? [];
  }

  static copy(other) {
    return new PlayerContext(
      structuredClone(other.attacker),
      structuredClone(other.bench),
    );
  }

  obfuscate() {
    const ret = PlayerContext.copy(this);

    if (ret.attacker.image) {
      // then this is not an empty slot
      ret.attacker.image = '/api/Cardback';
    }

    ret.bench = ret.bench.map((card) => {
      if (card.image) {
        card.image = '/api/Cardback';
        return card;
      }

      return card;
    });

    return ret;
  }
}

// used by server!
export class GameContext {
  startDate = new Date();
  endDate = null;

  turn = 0;
  gameState = 'active';

  member1Name = '';
  member2Name = '';
  currentTurnMember = null; // which member name's turn it currently is

  member1Data = new PlayerContext();
  member2Data = new PlayerContext();

  areCardsVisible = false;

  constructor(
    turn,
    gameState,
    member1Name,
    member2Name,
    member1Data,
    member2Data,
  ) {
    this.startDate = new Date();
    this.endDate = null;

    this.turn = turn ?? 0;
    this.gameState = gameState;

    this.member1Name = member1Name ?? '';
    this.member2Name = member2Name ?? '';

    this.member1Data = member1Data ?? new PlayerContext();
    this.member2Data = member2Data ?? new PlayerContext();

    this.areCardsVisible = turn > 1; // cards hidden until turn 2, each half turn is a single turn

    this.currentTurnMember = null;
  }

  setPlayerContext(memberName, playerContext) {
    if (memberName === this.member1Name) {
      this.member1Data = playerContext;
    } else if (memberName === this.member2Name) {
      this.member2Data = playerContext;
    }
  }

  incrementTurn() {
    this.turn += 1;

    if (this.currentTurnMember) {
      this.currentTurnMember =
        this.currentTurnMember === this.member1Name
          ? this.member1Name
          : this.member2Name;
    }

    return this.turn;
  }

  randomizeTurn() {
    const coinFlip = randGenInt(0, 1);
    if (coinFlip === 0) {
      this.currentTurnMember = this.member1Name;
    } else {
      this.currentTurnMember = this.member2Name;
    }
  }

  get currentPlayer() {
    return this.currentTurnMember;
  }

  get nextPlayer() {
    return this.currentTurnMember === this.member1Name
      ? this.member2Name
      : this.member1Name;
  }
}
