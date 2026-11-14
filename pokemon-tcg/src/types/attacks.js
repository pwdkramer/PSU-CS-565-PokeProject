import {
  statusEffects,
  targets,
  DamageAction,
  CoinDamageAction,
  CoinFlipAction,
  StatusAction,
  DiscardEnergyAction,
  BenchDamageAction,
  ShieldAction,
  CustomAction,
} from './actions.js';

// attacks shared across multiple pokemon (for simplicity)
const Shared = {
  confuseRay: (flip, dmg) => [
    new DamageAction(targets.defender, dmg),
    new CoinFlipAction(flip, [
      new StatusAction(targets.defender, statusEffects.confused),
    ]),
  ],
  coinFlipStatusEffect: (flip, effect, target = targets.defender) => [
    new CoinFlipAction(flip, [new StatusAction(target, effect)]),
  ],
  coinFlipStatusEffectDamage: (
    dmg,
    flip,
    effect,
    target = targets.defender,
  ) => [
    new DamageAction(target, dmg),
    new CoinFlipAction(flip, [new StatusAction(target, effect)]),
  ],
  preventDamageOn: (flip) => [
    new CoinFlipAction(flip, [
      new ShieldAction(targets.self, 'prevent_damage'),
    ]),
  ],
  discardSelfEnergy: (discardCount, dmg) => [
    new DiscardEnergyAction(targets.self, discardCount),
    ...(dmg > 0 ? [new DamageAction(targets.defender, dmg)] : []),
  ],
};

export const ATTACK_EFFECTS = Object.freeze({
  'base1-1': {
    // Alakazam
    'Confuse Ray': Shared.confuseRay(CoinFlipAction.heads, 30),
  },
  'base1-2': {
    // Blastoise
    'Hydro Pump': [new CustomAction('Hydro Pump')],
  },
  'base1-3': {
    // Chansey
    Scrunch: Shared.preventDamageOn(CoinDamageAction.heads),
    'Double-edge': [
      new DamageAction(targets.defender, 80),
      new DamageAction(targets.self, 80),
    ],
  },
  'base1-4': {
    // Charizard
    'Fire Spin': Shared.discardSelfEnergy(2, 100),
  },
  'base1-5': {
    // Clefairy
    Sing: Shared.coinFlipStatusEffect(
      CoinFlipAction.heads,
      statusEffects.sleep,
    ),
    Metronome: [new CustomAction('Metronome')],
  },
  'base1-6': {
    // Gyarados
    'Dragon Rage': [new DamageAction(targets.defender, 50)],
    Bubblebeam: Shared.coinFlipStatusEffectDamage(
      40,
      CoinFlipAction.heads,
      statusEffects.paralyze,
    ),
  },
  'base1-7': {
    // Hitmonchan
    Jab: [new DamageAction(targets.defender, 20)],
    'Special Punch': [new DamageAction(targets.defender, 40)],
  },
  'base1-8': {
    // Machamp
    'Seismic Toss': [new DamageAction(targets.defender, 60)],
  },
  'base1-9': {
    // Magneton
    'Thunder Wave': Shared.coinFlipStatusEffectDamage(
      30,
      CoinFlipAction.heads,
      statusEffects.paralyze,
    ),
    Selfdestruct: [
      new DamageAction(targets.defender, 80),
      new DamageAction(targets.bench, 20),
      new DamageAction(targets.self, 80),
    ],
  },
  'base1-10': {
    // Mewtwo
    Psychic: [new CustomAction('Psychic')],
    Barrier: [new CusomAction('Barrier')],
  },
  'base1-11': {
    // Nidoking
    Thrash: [
      new CoinFlipAction(
        CoinFlipAction.heads,
        [new DamageAction(targets.defender, 40)],
        [
          new DamageAction(targets.defender, 30),
          new DamageAction(targets.self, 10),
        ],
      ),
    ],
    Toxic: [
      new DamageAction(targets.defender, 20),
      new StatusAction(targets.defender, statusEffects.poison),
    ],
  },
});
