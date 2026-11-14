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

  constructor({ evolveFrom, stage }) {
    this.name = evolveFrom ?? null;
    const lastCharNum = Number(stage?.[stage.length - 1]);

    if (stage === 'Basic') {
      this.stage = 0;
    } else if (Number.isInteger(lastCharNum)) {
      this.stage = lastCharNum;
    } else {
      throw new Error(`Failed to parse EvolveFrom stage. Received: ${stage}`);
    }
  }

  mapId(cardsList) {
    if (this.stage > 0) {
      cardsList.some((card) => {
        const {
          identification: { id },
          name,
        } = card;
        if (name === this.name) {
          this.id = id;
          return true; // early exit
        }
        return false;
      });
    }
  }
}

export class RawPokemonCard {
  identification = null; // Identification instance
  evolveFrom = null;

  name = '';
  hp = 0;

  types = [];
  abilities = [];
  attacks = [];
  weaknesses = [];

  constructor(rawData) {
    this.identification = new Identification(rawData);
    this.evolveFrom = new EvolveFrom(rawData);

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
  identification = null;

  name = '';
  effect = '';

  constructor(rawData) {
    this.identification = new Identification(rawData);
    ({ name: this.name, effect: this.effect } = rawData);
  }
}

export class RawEnergyCard {
  identification = null;

  name = '';
  energyType = ''; // Base or Special (only base1-96)

  constructor(rawData) {
    this.identification = new Identification(rawData);
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

export const updateCardFields = function setEvolvesFromId(cardarray) {
  cardarray.forEach((card) => {
    if (card.identification.category === 'Pokemon') {
      card.evolveFrom.mapId(cardarray);
    }
  });
};
