export class PlayerContext {
  attacker = null;
  hp = 100;
  bench = [];

  constructor(attacker, hp, bench) {
    this.attacker = attacker ?? null;
    this.hp = hp ?? 100;
    this.bench = bench ?? [];
  }

  static copy(other) {
    return new PlayerContext(other.attacker, other.hp, other.bench);
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
  }

  setPlayerContext(memberName, playerContext) {
    if (memberName === this.member1Name) {
      this.member1Data = playerContext;
    } else if (memberName === this.member2Name) {
      this.member2Data = playerContext;
    }
  }
}
