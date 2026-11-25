import { statusEffects } from './actions.js';
import { ATTACK_EFFECTS } from './attacks.js';
import { ABILITY_EFFECTS } from './abilities.js';
import { TRAINER_EFFECTS } from './trainers.js';

export class Identification {
  category = '';
  id = '';
  imageLocation = '';
  localId = '';
  rarity = '';

  constructor({ category, id, image, localId, rarity }) {
    this.category = category;
    this.id = id;
    this.imageLocation = image;
    this.localId = localId;
    this.rarity = rarity;
  }
}

export class EvolveFrom {
  id = null;
  name = null;
  stage = 0;

  constructor({ evolveFrom, evolveFromId, stage }) {
    this.name = evolveFrom ?? null;
    this.id = evolveFrom ?? null;
    const lastCharNum = Number(stage?.[stage.length - 1]);

    if (stage === 'Basic') {
      this.stage = 0;
    } else if (Number.isInteger(lastCharNum)) {
      this.stage = lastCharNum;
    } else {
      throw new Error(`Failed to parse EvolveFrom stage. Received: ${stage}`);
    }
  }

  isEvolved() {
    return this.stage > 0;
  }
}

// abstract base class
class BaseCard {
  identification = null;

  get id() {
    return this.identification ? this.identification.id : null;
  }

  get image() {
    return this.identification ? this.identification.imageLocation : null;
  }

  get category() {
    return this.identification ? this.identification.category : null;
  }
}

export class RawPokemonCard extends BaseCard {
  evolveFrom = null;

  name = '';
  hp = 0;

  types = [];
  abilities = [];
  attacks = [];
  weaknesses = [];

  attachedEnergy = []; // energy cards
  statuses = [];

  constructor(rawData) {
    super();
    this.identification = new Identification(rawData);
    this.evolveFrom = new EvolveFrom(rawData);

    const { name, hp, types, abilities, attacks, weaknesses } = rawData;
    this.name = name;
    this.hp = hp;
    this.types = types;
    this.abilities = abilities;
    this.attacks = attacks;
    this.weaknesses = weaknesses;

    this.attachedEnergy = []; // energy cards
    this.statuses = [];

    this.setupAttacks();
    this.setupAbilities();
  }

  get stage() {
    // returns a string to mimick the raw card json
    // use getStage() method for integer representation
    const intStage = this.evolveFrom.stage;
    return intStage === 0 ? 'Basic' : `stage${intStage}`;
  }

  setupAttacks() {
    // rawAttacks from http get is array of objects, one object for each attack
    const parsedAttacks = ATTACK_EFFECTS[this.id] ?? {};

    this.attacks = this.attacks?.map((attack) => {
      const parsedAttack = parsedAttacks[attack.name] ?? [];
      attack['parsed'] = parsedAttack;
      return attack;
    });
  }

  setupAbilities() {
    // parse abilities into structured form and insert as 'parsed' in this.abilities
    const parsedAbilities = ABILITY_EFFECTS[this.id] ?? {};

    this.abilities = this.abilities?.map((ability) => {
      const parsedAbility = parsedAbilities[ability.name] ?? [];
      ability['parsed'] = parsedAbility;
      return ability;
    });
  }

  isEvolved() {
    return this.evolveFrom?.isEvolved() ?? false;
  }

  getStage() {
    return this.evolveFrom?.stage ?? 0;
  }

  getAttachedEnergy() {
    return this.attachedEnergy;
  }

  getStatusEffects() {
    return this.statuses;
  }

  hasPokemonPower() {
    return this.abilities ? true : false;
  }

  canUsePokemonPower() {
    // blocked if asleep, confused, or paralyzed
    if (!this.hasPokemonPower()) return false;

    const current = this.getStatusEffects();
    return (
      !current.includes(statusEffects.sleep) &&
      !current.includes(statusEffects.confused) &&
      !current.includes(statusEffects.paralyze)
    );
  }
}

export class RawTrainerCard extends BaseCard {
  name = '';
  effect = '';
  canPlay = null;
  parsed = null;

  constructor(rawData) {
    super();
    this.identification = new Identification(rawData);
    ({ name: this.name, effect: this.effect } = rawData);
    this.setupEffect();
  }

  setupEffect() {
    const { canPlay = () => true, actions = [] } =
      TRAINER_EFFECTS[this.id] ?? {};

    this.canPlay = canPlay;
    this.parsed = actions;
  }

  get id() {
    return this.identification ? this.identification.id : null;
  }

  get image() {
    return this.identification ? this.identification.imageLocation : null;
  }
}

export class RawEnergyCard extends BaseCard {
  name = '';
  energyType = ''; // Base or Special (only base1-96)

  constructor(rawData) {
    super();
    this.identification = new Identification(rawData);
    ({ name: this.name, energyType: this.energyType } = rawData);
  }

  get id() {
    return this.identification ? this.identification.id : null;
  }

  get image() {
    return this.identification ? this.identification.imageLocation : null;
  }
}

export const buildRawCard = function buildRawCardFromHttpData(rawData) {
  const { category } = rawData;
  switch (category) {
    case 'Pokemon':
      return new RawPokemonCard(rawData);
    case 'Trainer':
      return new RawTrainerCard(rawData);
    case 'Energy':
      return new RawEnergyCard(rawData);
  }
};