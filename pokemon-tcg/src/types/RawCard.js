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

export class EvolvesFrom {
  id = null;
  name = null;
  stage = 0;

  constructor({ EvolvesFrom, stage }) {
    console.log(stage);
    this.name = EvolvesFrom;
    const lastCharNum = Number(stage?.[stage.length - 1]);

    if (stage === 'Basic') {
      this.stage = 0;
    } else if (Number.isInteger(lastCharNum)) {
      this.stage = lastCharNum;
    } else {
      throw new Error(`Failed to parse EvolvesFrom stage. Received: ${stage}`);
    }
  }
}

export class RawPokemonCard {
  identification = null; // Identification instance
  evolvesFrom = null;

  name = '';
  hp = 0;

  types = [];
  abilities = [];
  attacks = [];
  weaknesses = [];

  constructor(rawData) {
    console.log(rawData.id);
    this.identification = new Identification(rawData);
    this.evolvesFrom = new EvolvesFrom(rawData);

    const { name, hp, types, abilities, attacks, weaknesses } = rawData;
    this.name = name;
    this.hp = hp;
    this.types = types;
    this.abilities = abilities;
    this.attacks = attacks;
    this.weaknesses = weaknesses;
  }
}

export class RawTrainerCard {
  constructor(rawData) {}
}

export class RawEnergyCard {
  constructor(rawData) {}
}

const buildRawCard = function buildRawCardFromHttpData(rawData) {
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

export default buildRawCard;
