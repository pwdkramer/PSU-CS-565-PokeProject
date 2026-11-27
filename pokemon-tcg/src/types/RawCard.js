import { statusEffects } from './actions.js';
import { ATTACK_EFFECTS } from './attacks.js';
import { ABILITY_EFFECTS } from './abilities.js';
import { TRAINER_EFFECTS } from './trainers.js';

/* // Replaced to flatten the card objects for serialization 
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
    this.id = evolveFromId ?? null;
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
}*/

// all card types share these identifiation attributes
class BaseCard {
  // identification
  category = '';
  id = '';
  image = '';
  localId = '';
  rarity = '';

  constructor(rawData) {
    ({
      category: this.category,
      id: this.id,
      image: this.image,
      localId: this.localId,
      rarity: this.rarity,
    } = rawData);
  }

  isPokemonCard() {
    return this.category === 'Pokemon';
  }

  isTrainerCard() {
    return this.category === 'Trainer';
  }

  isEnergyCard() {
    return this.category === 'Energy';
  }
}

export class RawPokemonCard extends BaseCard {
  // evolve from info
  evolveFrom = '';
  evolveFromId = '';
  stage = 0;

  name = '';
  hp = 0;

  types = [];
  abilities = [];
  attacks = [];
  weaknesses = [];

  attachedEnergy = []; // energy cards
  statuses = [];

  constructor(rawData) {
    // only keep info we need
    super(rawData);

    ({
      evolveFrom: this.evolveFrom,
      evolveFromId: this.evolveFromId,
      stage: this.stage,
    } = rawData);
    ({
      name: this.name,
      hp: this.hp,
      types: this.types,
      abilities: this.abilities,
      attacks: this.attacks,
      weaknesses: this.weaknesses,
    } = rawData);

    this.attachedEnergy = []; // energy cards
    this.statuses = [];

    this.setupAttacks();
    this.setupAbilities();
  }

  get stage() {
    // returns a string to mimick the raw card json
    // use getStage() method for integer representation
    const intStage = this.stage;
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
    return this.stage > 0;
  }

  getStage() {
    return this.stage ?? 0;
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
    super(rawData);

    ({ name: this.name, effect: this.effect } = rawData);

    this.setupEffect();
  }

  setupEffect() {
    const { canPlay = () => true, actions = [] } =
      TRAINER_EFFECTS[this.id] ?? {};

    this.canPlay = canPlay;
    this.parsed = actions;
  }
}

export class RawEnergyCard extends BaseCard {
  name = '';
  energyType = ''; // Base or Special (only base1-96)

  constructor(rawData) {
    super(rawData);

    ({ name: this.name, energyType: this.energyType } = rawData);
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
