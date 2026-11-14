export const statusEffects = Object.freeze({
  sleep: 'sleep',
  paralyze: 'paralyze',
  confused: 'confused',
  poison: 'poison',
});

export const targets = Object.freeze({
  self: 'self',
  defender: 'defender',
  bench: 'bench',
});

export class DamageAction {
  target = ''; // self | defender | bench
  amount = 0;
  constructor(target, amount) {
    this.target = target;
    this.amount = amount;
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
}

export class StatusAction {}
export class DiscardEnergyAction {}
export class BenchDamageAction {}
export class ShieldAction {}
export class CustomAction {}
