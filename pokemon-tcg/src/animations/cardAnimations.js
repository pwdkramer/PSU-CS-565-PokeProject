const CARD_ANI = Object.freeze({
  AttackSelf: {
    action: [
      { transform: 'translateY(+40px)', offset: 0.25 }, // offset is % of total duration
      { transform: 'translateY(-120px)', offset: 0.6 },
      { transform: 'translateY(0)' },
    ],
    timing: {
      duration: 600, // ms
      iterations: 1,
    },
  },
  AttackOpponent: {
    action: [
      { transform: 'translateY(-40px)', offset: 0.25 }, // offset is % of total duration
      { transform: 'translateY(+120px)', offset: 0.6 },
      { transform: 'translateY(0)' },
    ],
    timing: {
      duration: 600, // ms
      iterations: 1,
    },
  },
  DamagedSelf: {
    action: [
      { transform: 'translateY(+20px)', offset: 0.05 },
      { transform: 'translateY(+20px) rotate(50deg)', offset: 0.15 },
      { transform: 'translateY(+20px) rotate(-50deg)', offset: 0.35 },
      { transform: 'translateY(+20px) rotate(50deg)', offset: 0.55 },
      { transform: 'translateY(+20px) rotate(-50deg)', offset: 0.75 },
      { transform: 'translateY(+20px) rotate(50deg)', offset: 0.95 },
      { transform: 'translateY(0px) rotate(0deg)', offset: 1 },
    ],
    timing: {
      duration: 300,
      iterations: 1,
    },
  },
  DamagedOpponent: {
    action: [
      { transform: 'translateY(-20px)', offset: 0.05 },
      { transform: 'translateY(-20px) rotate(-50deg)', offset: 0.15 },
      { transform: 'translateY(-20px) rotate(50deg)', offset: 0.35 },
      { transform: 'translateY(-20px) rotate(-50deg)', offset: 0.55 },
      { transform: 'translateY(-20px) rotate(50deg)', offset: 0.75 },
      { transform: 'translateY(-20px) rotate(-50deg)', offset: 0.95 },
      { transform: 'translateY(0px) rotate(0deg)', offset: 1 },
    ],
    timing: {
      duration: 500,
      iterations: 1,
    },
  },
});
