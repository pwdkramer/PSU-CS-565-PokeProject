export class PlayerContext {
  attacker = null;
  hp = 100;
  bench = [];  

  constructor(attacker, hp, bench) {
    this.attacker = attacker?? null;
    this.hp = hp?? 100;
    this.bench = bench?? [];
  }
}

// used by server!
export class GameContext {
  turn = 0;
  gameState = 'active';
  
  member1Name = '';
  member2Name = '';

  member1Data = new PlayerContext;
  member2Data = new PlayerContext;
  
  areCardsVisible = false;

  constructor(
    turn,
    gameState,
    member1Name,
    member2Name,
    member1Data,
    member2Data,
  ) 
  {
    this.turn = turn?? 0;
    this.gameState = gameState;

    this.member1Name = member1Name?? '';
    this.member2Name = member2Name?? '';

    this.member1Data = member1Data?? new PlayerContext();
    this.member2Data = member2Data?? new PlayerContext();

    this.areCardsVisible = turn > 1; // cards hidden until turn 2, each half turn is a single turn
  }
}
