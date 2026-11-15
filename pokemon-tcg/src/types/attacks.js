import {
  statusEffects,
  targets,
  energyTypes,
  DamageAction,
  CoinDamageAction,
  CoinFlipAction,
  StatusAction,
  DiscardEnergyAction,
  BenchDamageAction,
  ShieldAction,
  BenchSwap,
  DamageCounterMultiplier,
  HealAction,
  SealAttackAction,
  ChangeAttributeAction,
  ExtraEnergyDamage,
  CustomAction,
} from './actions.js';

// attacks shared across multiple pokemon (for simplicity)
/*const Shared = {
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
};*/

export const ATTACK_EFFECTS = Object.freeze({
  'base1-1': {
    // Alakazam
    'Confuse Ray': [
      new DamageAction(targets.defender, 30),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.confused),
      ]),
    ],
  },
  'base1-2': {
    // Blastoise
    'Hydro Pump': [
      new ExtraEnergyDamage(targets.defender, energyTypes.water, 10, 2, 40),
    ],
  },
  'base1-3': {
    // Chansey
    Scrunch: [
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.self, statusEffects.shield),
      ]),
    ],
    'Double-edge': [
      new DamageAction(targets.defender, 80),
      new DamageAction(targets.self, 80),
    ],
  },
  'base1-4': {
    // Charizard
    'Fire Spin': [
      new DiscardEnergyAction(targets.self, 2),
      new DamageAction(targets.defender, 100),
    ],
  },
  'base1-5': {
    // Clefairy
    Sing: [
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.sleep),
      ]),
    ],
    Metronome: [new CustomAction('Metronome')],
  },
  'base1-6': {
    // Gyarados
    'Dragon Rage': [new DamageAction(targets.defender, 50)],
    Bubblebeam: [
      new DamageAction(targets.defender, 40),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
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
    'Thunder Wave': [
      new DamageAction(targets.defender, 30),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
    Selfdestruct: [
      new DamageAction(targets.defender, 80),
      new DamageAction(targets.benchAll, 20),
      new DamageAction(targets.self, 80),
    ],
  },
  'base1-10': {
    // Mewtwo
    Psychic: [new CustomAction('Psychic')],
    Barrier: [
      new DiscardEnergyAction(targets.self, 1),
      new StatusAction(targets.self, statusEffects.invincible),
    ],
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
      new StatusAction(targets.defender, statusEffects.toxic),
    ],
  },
  'base1-12': {
    // Ninetales
    Lure: [new BenchSwap(targets.self)],
    'Fire Blast': [
      new DiscardEnergyAction(targets.self, 1),
      new DamageAction(targets.defender, 80),
    ],
  },
  'base1-13': {
    // Poliwrath
    'Water Gun': [
      new ExtraEnergyDamage(targets.defender, energyTypes.water, 10, 2, 30),
    ],
    Whirlpool: [
      new DamageAction(targets.defender, 40),
      new DiscardEnergyAction(targets.defender, 1),
    ],
  },
  'base1-14': {
    // Raichu
    Agility: [
      new DamageAction(targets.defender, 20),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.self, statusEffects.invincible),
      ]),
    ],
    Thunder: [
      new DamageAction(targets.defender, 60),
      new CoinFlipAction(CoinFlipAction.tails, [
        new DamageAction(targets.self, 30),
      ]),
    ],
  },
  'base1-15': {
    // Venusaur
    Solarbeam: [new DamageAction(targets.defender, 60)],
  },
  'base1-16': {
    // Zapdos
    Thunder: [
      new DamageAction(targets.defender, 60),
      new CoinFlipAction(CoinFlipAction.tails, [
        new DamageAction(targets.self, 30),
      ]),
    ],
    Thunderbolt: [
      new DamageAction(targets.defender, 100),
      new DiscardEnergyAction(targets.self, 999), // discard all cards
    ],
  },
  'base1-17': {
    // Beedrill
    Twineedle: [new CoinDamageAction(CoinFlipAction.heads, 2, 30)],
    'Poison Sting': [
      new DamageAction(targets.defender, 40),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.poison),
      ]),
    ],
  },
  'base1-18': {
    // Dragonair
    Slam: [new CoinDamageAction(CoinFlipAction.heads, 2, 30)],
    'Hyper Beam': [
      new DamageAction(targets.defender, 20),
      new DiscardEnergyAction(targets.defender, 1),
    ],
  },
  'base1-19': {
    // Dugtrio
    Slash: [new DamageAction(targets.defender, 40)],
    Earthquake: [
      new DamageAction(targets.defender, 70),
      new DamageAction(targets.benchSelf, 10),
    ],
  },
  'base1-20': {
    // Electabuzz
    Thundershock: [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
    Thunderpunch: [
      new DamageAction(targets.defender, 30),
      new CoinFlipAction(
        CoinFlipAction.heads,
        [new DamageAction(targets.defender, 10)],
        [new DamageAction(targets.self, 10)],
      ),
    ],
  },
  'base1-21': {
    // Electrode
    'Electric Shock': [
      new DamageAction(targets.defender, 50),
      new CoinFlipAction(CoinFlipAction.tails, [
        new DamageAction(targets.self, 10),
      ]),
    ],
  },
  'base1-22': {
    // Pidgeotto
    Whirlwind: [
      new DamageAction(targets.defender, 20),
      new BenchSwap(targets.defender),
    ],
    'Mirror Move': [new CustomAction('Mirror Move')],
  },
  'base1-23': {
    // Arcanine
    Flamethrower: [
      new DiscardEnergyAction(targets.self, 1),
      new DamageAction(targets.defender, 50),
    ],
    'Take Down': [
      new DamageAction(targets.defender, 80),
      new DamageAction(targets.self, 30),
    ],
  },
  'base1-24': {
    // Charmeleon
    Slash: [new DamageAction(targets.defender, 30)],
    Flamethrower: [
      new DiscardEnergyAction(targets.self, 1),
      new DamageAction(targets.defender, 50),
    ],
  },
  'base1-25': {
    // Dewgong
    'Aurora Beam': [new DamageAction(targets.defender, 50)],
    'Ice Beam': [
      new DamageAction(targets.defender, 30),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
  },
  'base1-26': {
    // Dratini
    Pound: [new DamageAction(targets.defender, 10)],
  },
  'base1-27': {
    // Farfetch'd
    'Leek Slap': [
      new CoinFlipAction(CoinFlipAction.heads, [
        new DamageAction(targets.defender, 30),
      ]),
    ],
    'Pot Smash': [new DamageAction(targets.defender, 30)],
  },
  'base1-28': {
    // Growlithe
    Flare: [new DamageAction(targets.defender, 20)],
  },
  'base1-29': {
    Hypnosis: [new StatusAction(targets.defender, statusEffects.sleep)],
    'Dream Eater': [
      new Requirement(statusEffects.sleep, [
        new DamageAction(targets.defender, 50),
      ]),
    ],
  },
  'base1-30': {
    // Ivysaur
    'Vine Whip': [new DamageAction(targets.defender, 30)],
    Poisonpowder: [
      new DamageAction(targets.defender, 20),
      new StatusAction(targets.defender, statusEffects.poison),
    ],
  },
  'base1-31': {
    // Jynx
    Doubleslap: [new CoinDamageAction(CoinFlipAction.heads, 2, 10)],
    Meditate: [
      new DamageCounterMultiplier(targets.defender, targets.defender, 10, 20),
    ],
  },
  'base1-32': {
    // Kadabra
    Recover: [
      new DiscardEnergyAction(targets.self, 1),
      new HealAction(targets.self, 'all'),
    ],
    'Super Psy': [new DamageAction(targets.defender, 50)],
  },
  'base1-33': {
    // Kakuna
    Stiffen: [
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.self, statusEffects.shield),
      ]),
    ],
    Poisonpowder: [
      new DamageAction(targets.defender, 20),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.poison),
      ]),
    ],
  },
  'base1-34': {
    // Machoke
    'Karate Chop': [
      new DamageCounterMultiplier(targets.defender, targets.self, -10, 50),
    ],
    Submission: [
      new DamageAction(targets.defender, 60),
      new DamageAction(targets.self, 20),
    ],
  },
  'base1-35': {
    // Magikarp
    Tackle: [new DamageAction(targets.defender, 10)],
    Flail: [new DamageCounterMultiplier(targets.defender, targets.self, 10, 0)],
  },
  'base1-36': {
    // Magmar
    'Fire Punch': [new DamageAction(targets.defender, 30)],
    Flamethrower: [
      new DiscardEnergyAction(targets.self, 1),
      new DamageAction(targets.defender, 50),
    ],
  },
  'base1-37': {
    // Nidorino
    'Double Kick': [new CoinDamageAction(CoinFlipAction.heads, 2, 30)],
    'Horn Drill': [new DamageAction(targets.defender, 50)],
  },
  'base1-38': {
    // Poliwhirl
    Amnesia: [new SealAttackAction()],
    Doubleslap: [new CoinDamageAction(CoinFlipAction.heads, 2, 30)],
  },
  'base1-39': {
    // Porygon
    'Conversion 1': [new ChangeAttributeAction(targets.defender, 'weakness')],
    'Conversion 2': [new ChangeAttributeAction(targets.self, 'resistance')],
  },
  'base1-40': {
    // Raticate
    Bite: [new DamageAction(targets.defender, 20)],
    'Super Fang': [new CustomAction('Super Fang')],
  },
  'base1-41': {
    // Seel
    Headbutt: [new DamageAction(targets.defender, 10)],
  },
  'base1-42': {
    // Wartortle
    Withdraw: [
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.self, statusEffects.shield),
      ]),
    ],
    Bite: [new DamageAction(targets.defender, 40)],
  },
  'base1-43': {
    // Abra
    Psyshock: [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
  },
  'base1-44': {
    // Bulbasaur
    'Leech Seed': [
      new DamageAction(targets.defender, 20, [
        new HealAction(targets.self, 10),
      ]),
    ],
  },
  'base1-45': {
    // Caterpie
    'String Shot': [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
  },
  'base1-46': {
    // Charmander
    Scratch: [new DamageAction(targets.defender, 10)],
    Ember: [
      new DiscardEnergyAction(targets.self, 1),
      new DamageAction(targets.defender, 30),
    ],
  },
  'base1-47': {
    // Diglett
    Dig: [new DamageAction(targets.defender, 10)],
    'Mud Slap': [new DamageAction(targets.defender, 30)],
  },
  'base1-48': {
    // Doduo
    'Fury Attack': [new CoinDamageAction(CoinFlipAction.heads, 2, 10)],
  },
  'base1-49': {
    // Drowzee
    Pound: [new DamageAction(targets.defender, 10)],
    'Confuse Ray': [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.confused),
      ]),
    ],
  },
  'base1-50': {
    // Gastly
    'Sleeping Gas': [
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.sleep),
      ]),
    ],
    'Destiny Bond': [
      new DiscardEnergyAction(targets.self, 1),
      new StatusAction(targets.self, statusEffects.revenge),
    ],
  },
  'base1-51': {
    // Koffing
    'Foul Gas': [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(
        CoinFlipAction.heads,
        [new StatusAction(targets.defender, statusEffects.poison)],
        [new StatusAction(targets.defender, statusEffects.confused)],
      ),
    ],
  },
  'base1-52': {
    // Machop
    'Low Kick': [new DamageAction(targets.defender, 20)],
  },
  'base1-53': {
    // Magnemite
    'Thunder Wave': [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
    Selfdestruct: [
      new DamageAction(targets.defender, 40),
      new DamageAction(targets.benchAll, 10),
      new DamageAction(targets.self, 40),
    ],
  },
  'base1-54': {
    // Metapod
    Stiffen: [
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.self, statusEffects.shield),
      ]),
    ],
    'Stun Spore': [
      new DamageAction(targets.defender, 20),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
  },
  'base1-55': {
    // Nidoran♂
    'Horn Hazard': [
      new CoinFlipAction(CoinFlipAction.heads, [
        new DamageAction(targets.defender, 30),
      ]),
    ],
  },
  'base1-56': {
    // Onix
    'Rock Throw': [new DamageAction(targets.defender, 10)],
    Harden: [new CustomAction('Harden')],
  },
  'base1-57': {
    // Pidgey
    Whirlwind: [
      new DamageAction(targets.defender, 10),
      new BenchSwap(targets.defender),
    ],
  },
  'base1-58': {
    // Pikachu
    Gnaw: [new DamageAction(targets.defender, 10)],
    'Thunder Jolt': [
      new DamageAction(targets.defender, 30),
      new CoinFlipAction(CoinFlipAction.tails, [
        new DamageAction(targets.self, 10),
      ]),
    ],
  },
  'base1-59': {
    // Poliwag
    'Water Gun': [
      new ExtraEnergyDamage(targets.defender, energyTypes.water, 10, 2, 10),
    ],
  },
  'base1-60': {
    // Ponyta
    'Smash Kick': [new DamageAction(targets.defender, 20)],
    'Flame Tail': [new DamageAction(targets.defender, 30)],
  },
  'base1-61': {
    // Rattata
    Bite: [new DamageAction(targets.defender, 20)],
  },
  'base1-62': {
    // Sandshrew
    'Sand-attack': [
      new DamageAction(targets.defender, 10),
      new CustomAction('Sand-attack'),
    ],
  },
  'base1-63': {
    // Squirtle
    Bubble: [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
    Withdraw: [
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.self, statusEffects.shield),
      ]),
    ],
  },
  'base1-64': {
    // Starmie
    Recover: [
      new DiscardEnergyAction(targets.self, 1),
      new HealAction(targets.self, 'all'),
    ],
    'Star Freeze': [
      new DamageAction(targets.defender, 20),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
  },
  'base1-65': {
    // Staryu
    Slap: [new DamageAction(targets.defender, 20)],
  },
  'base1-66': {
    // Tangela
    Bind: [
      new DamageAction(targets.defender, 20),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.paralyze),
      ]),
    ],
    Poisonpowder: [
      new DamageAction(targets.defender, 20),
      new StatusAction(targets.defender, statusEffects.poison),
    ],
  },
  'base1-67': {
    // Voltorb
    Tackle: [new DamageAction(targets.defender, 10)],
  },
  'base1-68': {
    // Vulpix
    'Confuse Ray': [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.confused),
      ]),
    ],
  },
  'base1-69': {
    // Weedle
    'Poison Sting': [
      new DamageAction(targets.defender, 10),
      new CoinFlipAction(CoinFlipAction.heads, [
        new StatusAction(targets.defender, statusEffects.poison),
      ]),
    ],
  },
});

const singleUseActions = ['Leek Slap'];
