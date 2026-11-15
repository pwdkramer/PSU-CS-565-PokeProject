export const statusEffects = Object.freeze({
  sleep: 'sleep',
  paralyze: 'paralyze',
  confused: 'confused',
  poison: 'poison',
  toxic: 'toxic',
  immune: 'immune', // immue to all status effects
  invincible: 'invincible', // immune to all status effects AND damage
  shield: 'shield', // immune to damage but not other status effects
  revenge: 'revenge',
  amnesia: 'amnesia',
  harden: 'harden',
  blind: 'blind',
  defender: 'defender',
  heal: 'heal', // remove sleep, confused, paralyze, and posion
  plusPower: 'plusPower', // adds 10 damage if damage was done
  energyBurn: 'energyBurn',
});

export const targets = Object.freeze({
  self: 'self',
  defender: 'defender',
  benchSelf: 'benchSelf',
  benchAll: 'benchAll',
  opponent: 'opponent',
  both: 'both',
  selected: 'selected', // the selected card
});

export const energyTypes = Object.freeze({
  water: 'Water',
  psychic: 'Psychic',
  lightning: 'Lightning',
  grass: 'Grass',
  fire: 'Fire',
  fighting: 'Fighting',
  colorless: 'Colorless',
});

export const customActions = Object.freeze({
  metronome: 'Metronome',
  pyschic: 'Psychic',
  mirrorMove: 'Mirror Move',
  dreamEater: 'Dream Eater',
  superFang: 'Super Fang',
  // trainer card actions
  clefairyDoll: 'Clefairy Doll',
  devolutionSpray: 'Devolution Spray',
  lass: 'Lass',
  pokemonBreeder: 'Pokemon Breeder',
  scoopUp: 'Scoop Up',
  pokedex: 'Pokedex',
  revive: 'Revive',
  // ability / pokemon powers
  damageSwap: 'Damage Swap',
  rainDance: 'Rain Dance',
  energyTrans: 'energyTrans',
  buzzap: 'buzzap',
});

export const cardGroups = Object.freeze({
  bench: 'bench',
  hand: 'hand',
  deck: 'deck',
  discard: 'discard',
  deckPlusHand: 'deck+hand',
  benchPlusActive: 'bech+active',
  active: 'active',
});

export const selectionTypes = Object.freeze({
  top: 'top',
  select: 'select',
  random: 'random',
  all: 'all',
});

export const filterTypes = Object.freeze({
  none: null,
  trainer: 'trainer',
  basicPokemon: 'basic',
  anyPokemon: 'pokemon',
  energy: 'energy,',
});

// abstract base class for all actions
class ActionBase {
  /** @param {BattleContext} context */
  async execute(context) {
    throw new Error(`${this.constructor.name} must implement execute(context)`);
  }
}

export class DamageAction extends ActionBase {
  target = ''; // self | defender | bench
  amount = 0;
  onHit = [];

  constructor(target, amount, onHit = []) {
    super();

    this.target = target;
    this.amount = amount;
    this.onHit = onHit;
  }

  async execute(context) {}
}

export class CoinFlipAction extends ActionBase {
  static heads = 1;
  static tails = 2;

  flip = 1;
  onSuccess = [];
  onFail = [];

  constructor(flip, onSuccess, onFail = []) {
    super();

    this.flip = flip;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
  }

  async execute(context) {}
}

export class CoinDamageAction extends ActionBase {
  static heads = 1;
  static tails = 2;

  flip = 1;
  numberFlips = 2;
  multiplier = 30;

  constructor(flip, numberFlips, multiplier) {
    super();

    this.flip = flip;
    this.numberFlips = numberFlips;
    this.multiplier = multiplier;
  }

  async execute(context) {}
}

export class StatusAction extends ActionBase {
  target = null;
  effect = null;
  duration = 1; //-1 means forever / until explicitly cured

  constructor(target, effect) {
    super();

    this.target = target;
    this.effect = effect;

    if (
      effect === statusEffects.paralyze ||
      effect === statusEffects.immune ||
      effect === statusEffects.invincible ||
      effect === statusEffects.shield ||
      effect === statusEffects.revenge ||
      effect === statusEffects.amnesia ||
      effect === statusEffects.harden ||
      effect === statusEffects.defender
    ) {
      this.duration = 2; // decrement after EVERY turn (so a round is 2 turns)
    } else if (
      effect === statusEffects.heal ||
      effect === statusEffects.plusPower ||
      effect === statusEffects.energyBurn
    ) {
      this.duration = 1;
    } else {
      this.duration = -1; // lasts until cured
    }
  }

  async execute(context) {}
}

export class DiscardEnergyAction extends ActionBase {
  target = null;
  amount = 1;
  onSuccess = [];

  constructor(target, amount, onSuccess = []) {
    super();

    this.target = target;
    this.amount = amount;
    this.onSuccess = onSuccess;
  }

  async execute(context) {}
}

export class BenchSwap extends ActionBase {
  assignee = null; //target

  constructor(assignee) {
    super();

    this.assignee = assignee;
  }

  async execute(context) {}
}

export class DamageCounterMultiplier extends ActionBase {
  // <damageMultiplier> x number of damage counters on <counterTarget> + <baseDamage> to <target>
  target = null;
  counterTarget = null;
  damageMultiplier = 0;
  baseDamage = 0;

  constructor(target, counterTarget, damageMultiplier, baseDamage = 0) {
    super();

    this.target = target;
    this.counterTarget = counterTarget;
    this.damageMultiplier = damageMultiplier;
    this.baseDamage = baseDamage;
  }

  async execute(context) {}
}

export class ChangeAttributeAction extends ActionBase {
  target = null;
  changeType = null; // 'weakness' || 'resistance'

  constructor(target, changeType) {
    super();

    this.target = target;
    this.changeType = changeType;
  }

  async execute(context) {}
}

export class ExtraEnergyDamage extends ActionBase {
  target = null;
  energyType = null;
  damagePer = 0;
  energyCap = 2;
  baseDamage = 0;

  constructor(target, energyType, damagePer, energyCap, baseDamage) {
    super();

    this.target = target;
    this.energyType = energyType;
    this.damagePer = damagePer;
    this.energyCap = energyCap;
    this.baseDamage = baseDamage;
  }

  async execute(context) {}
}

export class CustomAction extends ActionBase {
  name = '';

  constructor(name) {
    super();
    // options: Metronome, Psychic, Mirror Move, Dream Eater, Super Fang
    this.name = name;
  }

  async execute(context) {
    switch (this.name) {
      case customActions.metronome:
        break;
      case customActions.pyschic:
        break;
      case customActions.mirrorMove:
        break;
      case customActions.dreamEater:
        break;
      case customActions.superFang:
        break;
      case customActions.clefairyDoll:
        break;
      case customActions.lass:
        break;
      case customActions.pokemonBreeder:
        break;
      case customActions.scoopUp:
        break;
      case customActions.pokedex:
        break;
      case customActions.revive:
        break;
      case customActions.damageSwap:
        break;
      case customActions.rainDance:
        break;
      case customActions.energyTrans:
        break;
      case customActions.buzzap:
        break;
      default:
        throw new Error(
          `Unexpected attack passed to CustomAction: ${this.name}`,
        );
    }
  }
}

export class MoveCardsAction extends ActionBase {
  player = null; // 'self' | 'opponent' | 'both'
  from = null; // 'deck' | 'hand' | 'discard'
  to = null; // 'hand' | 'deck' | 'discard' | 'bench'
  count = 0; // number
  upTo = false; // true for "up to 2" (Energy Retrieval)
  selection = null; // selectionTypes
  filter = null; // filterTypes

  constructor(
    player,
    from,
    to,
    count,
    upTo = false,
    selection = 'top',
    filter = null,
  ) {
    super();

    this.player = player; // 'self' | 'opponent' | 'both'
    this.from = from; // 'deck' | 'hand' | 'discard'
    this.to = to; // 'hand' | 'deck' | 'discard' | 'bench'
    this.count = count; // number
    this.upTo = upTo; // true for "up to 2" (Energy Retrieval)
    this.selection = selection; // 'selectionTypes
    this.filter = filter; //filterTypes
  }

  async execute(context) {}
}

export class Shuffle extends ActionBase {
  target = null;
  what = null; // cardGroups

  constructor(target, what = cardGroups.deck) {
    super();

    this.target = target;
    this.what = what;
  }

  async execute(context) {}
}

export class Show extends ActionBase {
  target = null;
  what = null; // cardGroups

  constructor(target, what = cardGroups.hand) {
    super();

    this.target = target;
    this.what = what;
  }

  async execute(context) {}
}

export class Attach extends ActionBase {
  target = null;
  onAttach = [];

  constructor(target, onAttach = []) {
    super();

    this.target = target;
    this.onAttach = onAttach;
  }

  async execute(context) {}
}

export class Select extends ActionBase {
  target = null;
  cardGroups = [];
  onSelect = [];

  constructor(target, cardGroups, onSelect = []) {
    super();

    this.target = target;
    this.cardGroups = cardGroups;
    this.onSelect = onSelect;
  }

  async execute(context) {}
}

export class Swap extends ActionBase {
  one = null;
  two = null;

  constructor(one, two) {
    super();

    this.one = one;
    this.two = two;
  }

  async execute(context) {}
}
