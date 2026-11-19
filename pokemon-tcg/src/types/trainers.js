import {
  statusEffects,
  targets,
  customActions,
  DamageAction,
  StatusAction,
  CustomAction,
  MoveCardsAction,
  Shuffle,
  Show,
  Attach,
  Select,
  Swap,
  selectionTypes,
  filterTypes,
  cardGroups,
} from './actions.js';

export const TRAINER_EFFECTS = Object.freeze({
  'base1-70': {
    // Clefairy Doll
    canPlay: (context) => context.player.getDeck(cardGroups.bench).length < 5,
    actions: [new CustomAction(customActions.clefairyDoll)],
  },
  'base1-71': {
    // Computer Search
    canPlay: (context) => context.player.getCardCount(cardGroups.hand) >= 2,
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.hand,
        cardGroups.discard,
        2,
        false,
        selectionTypes.select,
        filterTypes.none,
      ),
      new MoveCardsAction(
        targets.self,
        cardGroups.deck,
        cardGroups.hand,
        1,
        false,
        selectionTypes.select,
        filterTypes.none,
      ),
      new Shuffle(targets.self, cardGroups.deck),
    ],
  },
  'base1-72': {
    // Devolution Spray
    canPlay: (context) => context.player.getEvolvedCards().length > 0,
    actions: [new CustomAction(customActions.devolutionSpray)],
  },
  'base1-73': {
    // Impostor Professor Oak
    canPlay: (context) => true,
    actions: [
      new Shuffle(targets.opponent, cardGroups.deckPlusHand),
      new MoveCardsAction(
        targets.opponent,
        cardGroups.deck,
        cardGroups.hand,
        7,
        false,
        selectionTypes.top,
        filterTypes.none,
      ),
    ],
  },
  'base1-74': {
    // Item Finder
    canPlay: (context) =>
      context.player.getCardCount(cardGroups.hand) >= 2 &&
      context.player.countTypeInDeck(filterTypes.trainer, cardGroups.discard) >
        0,
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.hand,
        cardGroups.discard,
        2,
        false,
        selectionTypes.select,
        filterTypes.none,
      ),
      new MoveCardsAction(
        targets.self,
        cardGroups.discard,
        cardGroups.hand,
        1,
        false,
        selectionTypes.select,
        filterTypes.trainer,
      ),
    ],
  },
  'base1-75': {
    // Lass
    canPlay: (context) => true,
    actions: [
      new Show(targets.both, cardGroups.hand),
      new MoveCardsAction(
        targets.both,
        cardGroups.hand,
        cardGroups.deck,
        999,
        false,
        selectionTypes.all,
        filterTypes.trainer,
      ),
      new Shuffle(targets.both, cardGroups.deck),
    ],
  },
  'base1-76': {
    // Pokémon Breeder
    canPlay: (context) => true, // toDo!
    actions: [new CustomAction(customActions.pokemonBreeder)],
  },
  'base1-77': {
    // Pokémon Trader
    canPlay: (context) => {
      return (
        context.player.countTypeInDeck(
          filterTypes.anyPokemon,
          cardGroups.hand,
        ) > 0 &&
        context.player.countTypeInDeck(
          filterTypes.anyPokemon,
          cardGroups.deck,
        ) > 0
      );
    },
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.hand,
        cardGroups.deck,
        1,
        false,
        selectionTypes.select,
        filterTypes.anyPokemon,
      ),
      new MoveCardsAction(
        targets.self,
        cardGroups.deck,
        cardGroups.hand,
        1,
        false,
        selectionTypes.select,
        filterTypes.anyPokemon,
      ),
      new Shuffle(targets.self, cardGroups.deck),
    ],
  },
  'base1-78': {
    // Scoop Up
    canPlay: (context) => true,
    actions: [new CustomAction(customActions.scoopUp)],
  },
  'base1-79': {
    // Super Energy Removal
    canPlay: (context) =>
      context.player.sumActiveAttachements() > 0 &&
      context.opponent.sumActiveAttachements() > 0,
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.benchPlusActive,
        cardGroups.discard,
        1,
        false,
        selectionTypes.select,
        filterTypes.energy,
      ),
      new MoveCardsAction(
        targets.opponent,
        cardGroups.benchPlusActive,
        cardGroups.discard,
        2,
        true,
        selectionTypes.select,
        filterTypes.energy,
      ),
    ],
  },
  'base1-80': {
    // Defender
    canPlay: (context) => true,
    actions: [
      new Attach(targets.self, [
        new StatusAction(targets.self, statusEffects.defender),
      ]),
    ],
  },
  'base1-81': {
    // Energy Retrieval
    canPlay: (context) => true,
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.hand,
        cardGroups.discard,
        1,
        false,
        selectionTypes.select,
        filterTypes.none,
      ),
      new MoveCardsAction(
        targets.self,
        cardGroups.discard,
        cardGroups.hand,
        2,
        true,
        selectionTypes.select,
        filterTypes.energy,
      ),
    ],
  },
  'base1-82': {
    // Full Heal
    canPlay: (context) => {
      const activeStatus = context.player.active.getStatusEffects();
      return (
        activeStatus.includes(statusEffects.sleep) ||
        activeStatus.includes(statusEffects.confused) ||
        activeStatus.includes(statusEffects.paralyze) ||
        activeStatus.includes(statusEffects.poison)
      );
    },
    actions: [new StatusAction(targets.self, statusEffects.heal)],
  },
  'base1-83': {
    // Maintenance
    canPlay: (context) => context.player.getDeck(cardGroups.hand).length > 1,
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.hand,
        cardGroups.deck,
        2,
        false,
        selectionTypes.select,
        filterTypes.none,
      ),
      new Shuffle(targets.self, cardGroups.deck),
      new MoveCardsAction(
        targets.self,
        cardGroups.deck,
        cardGroups.hand,
        1,
        false,
        selectionTypes.top,
        filterTypes.none,
      ),
    ],
  },
  'base1-84': {
    // PlusPower
    canPlay: (context) => true,
    actions: [
      new Attach(targets.self, [
        new StatusAction(targets.self, statusEffects.plusPower),
      ]),
    ],
  },
  'base1-85': {
    // Pokémon Center
    canPlay: (context) => true,
    actions: [
      new DamageAction(targets.self, -999, [
        new MoveCardsAction(
          targets.self,
          cardGroups.active,
          cardGroups.discard,
          999,
          false,
          selectionTypes.all,
          filterTypes.energy,
        ),
      ]),
      new DamageAction(targets.benchSelf, -999, [
        new MoveCardsAction(
          targets.self,
          cardGroups.bench,
          cardGroups.discard,
          999,
          false,
          selectionTypes.all,
          filterTypes.energy,
        ),
      ]),
    ],
  },
  'base1-86': {
    // Pokémon Flute
    canPlay: (context) => context.opponent.getDeck(cardGroups.bench).length < 5,
    actions: [
      new MoveCardsAction(
        targets.opponent,
        cardGroups.discard,
        cardGroups.bench,
        1,
        false,
        selectionTypes.select,
        filterTypes.basicPokemon,
      ),
    ],
  },
  'base1-87': {
    // Pokédex
    canPlay: (context) => true,
    actions: [new CustomAction(customActions.pokedex)],
  },
  'base1-88': {
    // Professor Oak
    canPlay: (context) => true,
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.hand,
        cardGroups.discard,
        999,
        false,
        selectionTypes.all,
        filterTypes.none,
      ),
      new MoveCardsAction(
        targets.self,
        cardGroups.deck,
        cardGroups.hand,
        7,
        false,
        selectionTypes.top,
        filterTypes.none,
      ),
    ],
  },
  'base1-89': {
    // Revive
    canPlay: (context) => context.player.getDeck(cardGroups.bench).length < 5,
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.discard,
        cardGroups.bench,
        1,
        false,
        selectionTypes.select,
        filterTypes.basicPokemon,
      ),
      new CustomAction(customActions.revive),
    ],
  },
  'base1-90': {
    // Super Potion
    canPlay: (context) => true, // toDo?
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.benchPlusActive,
        cardGroups.discard,
        1,
        false,
        selectionTypes.select,
        filterTypes.energy,
      ),
      new DamageAction(targets.selected, -40),
    ],
  },
  'base1-91': {
    // Bill
    canPlay: (context) => true,
    actions: [
      new MoveCardsAction(
        targets.self,
        cardGroups.deck,
        cardGroups.hand,
        2,
        false,
        selectionTypes.top,
        filterTypes.none,
      ),
    ],
  },
  'base1-92': {
    // Energy Removal
    canPlay: (context) => context.opponent.sumActiveAttachements() > 0,
    actions: [
      new MoveCardsAction(
        targets.opponent,
        cardGroups.benchPlusActive,
        cardGroups.discard,
        1,
        false,
        selectionTypes.select,
        filterTypes.energy,
      ),
    ],
  },
  'base1-93': {
    // Gust of Wind
    canPlay: (context) => context.opponent.getDeck(cardGroups.bench).length > 0,
    actions: [
      new Select(targets.opponent, cardGroups.bench, [
        new Swap(targets.selected, targets.defender),
      ]),
    ],
  },
  'base1-94': {
    // Potion
    canPlay: (context) => true,
    actions: [
      new Select(targets.self, cardGroups.benchPlusActive, [
        new DamageAction(targets.selected, -20),
      ]),
    ],
  },
  'base1-95': {
    // Switch
    canPlay: (context) => context.player.getDeck(cardGroups.bench).length > 0,
    actions: [
      new Select(targets.self, cardGroups.bench, [
        new Swap(targets.selected, targets.self),
      ]),
    ],
  },
});
