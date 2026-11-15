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
});

export const targets = Object.freeze({
  self: 'self',
  defender: 'defender',
  benchSelf: 'benchSelf',
  benchAll: 'benchAll',
});

export const energyTypes = Object.freeze({
  water: 'water',
});

export class DamageAction {
  target = ''; // self | defender | bench
  amount = 0;
  onHit = [];

  constructor(target, amount, onHit = []) {
    this.target = target;
    this.amount = amount;
    this.onHit = onHit;
  }
}

export class CoinFlipAction {
  static heads = 1;
  static tails = 2;

  flip = 1;
  onSuccess = [];
  onFail = [];

  constructor(flip, onSuccess, onFail = []) {
    this.flip = flip;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
  }
}

export class CoinDamageAction {
  static heads = 1;
  static tails = 2;

  flip = 1;
  numberFlips = 2;
  multiplier = 30;

  constructor(flip, numberFlips, multiplier) {
    this.flip = flip;
    this.numberFlips = numberFlips;
    this.multiplier = multiplier;
  }
}

export class StatusAction {
  target = null;
  effect = null;
  duration = 1; //-1 means forever / until explicitly cured

  constructor(target, effect) {
    this.target = target;
    this.effect = effect;

    if (
      effect === statusEffects.paralyze ||
      effect === statusEffects.immune ||
      effect === statusEffects.invincible ||
      effect === statusEffects.shield ||
      effect === statusEffects.revenge
    ) {
      this.duration = 1;
    } else {
      this.duration = -1;
    }
  }
}

export class DiscardEnergyAction {
  target = null;
  amount = 1;

  constructor(target, amount) {
    this.target = target;
    this.amount = amount;
  }
}

export class BenchDamageAction {}
export class ShieldAction {}
export class CustomAction {}

export class DamageMultiplier {
  // Blastoise and Poliwrath
  baseDamage = 0;
  energyType = '';
}

export class BenchSwap {
  assignee = null; //target

  constructor(assignee) {
    this.assignee = assignee;
  }
}

export class Requirement {
  effect = null;
  onSuccess = [];
  onFail = [];

  constructor(effect, onSuccess, onFail = []) {
    this.effect = effect;
    onSuccess = onSuccess;
    onFail = onFail;
  }
}

export class DamageCounterMultiplier {
  // <damageMultiplier> x number of damage counters on <counterTarget> + <baseDamage> to <target>
  target = null;
  counterTarget = null;
  damageMultiplier = 0;
  baseDamage = 0;

  constructor(target, counterTarget, damageMultiplier, baseDamage = 0) {
    this.target = target;
    this.counterTarget = counterTarget;
    this.damageMultiplier = damageMultiplier;
    this.baseDamage = baseDamage;
  }
}

export class HealAction {
  target = null;
  amount = 0; // number || 'all'

  constructor(target, amount) {
    this.target = target;
    this.amount = amount;
  }
}

export class SealAttackAction {}

export class ChangeAttributeAction {
  target = null;
  changeType = null;

  constructor(target, changeType, changeTo) {
    this.target = target;
    this.changeType = changeType;
  }
}

export class ExtraEnergyDamage {
  target = null;
  energyType = null;
  damagePer = 0;
  energyCap = 2;
  baseDamage = 0;

  constructor(target, energyType, damagePer, energyCap, baseDamage) {
    this.target = target;
    this.energyType = energyType;
    this.damagePer = damagePer;
    this.energyCap = energyCap;
    this.baseDamage = baseDamage;
  }
}
