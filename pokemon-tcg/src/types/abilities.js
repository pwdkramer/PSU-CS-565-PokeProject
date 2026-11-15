import {
  statusEffects,
  targets,
  energyTypes,
  customActions,
  DamageAction,
  CoinDamageAction,
  CoinFlipAction,
  StatusAction,
  DiscardEnergyAction,
  BenchSwap,
  DamageCounterMultiplier,
  ChangeAttributeAction,
  ExtraEnergyDamage,
  CustomAction,
  cardGroups,
} from './actions.js';

import { RawEnergyCard } from './rawCard.js';

export const ABILITY_EFFECTS = Object.freeze({
  'base1-1': {
    // Alakazam
    trigger: 'active',
    canPlay: (context) =>
      context.player.selected.canUsePokemonPower() &&
      context.player.getCardCount(cardGroups.benchPlusActive) >= 2,
    actions: [new CustomAction(customActions.damageSwap)],
  },
  'base1-2': {
    // Blastoise
    trigger: 'active',
    canPlay: (context) => {
      context.player.selected.canUsePokemonPower() &&
        context.player
          .getDeck(cardGroups.hand)
          .some(
            (card) =>
              card instanceof RawEnergyCard && card.name === 'Water Energy',
          );
    },
    actions: [new CustomAction(customActions.rainDance)],
  },
  'base1-4': {
    // Charizard
    trigger: 'active',
    canPlay: (context) => {
      context.player.selected.canUsePokemonPower() &&
        context.player.selected.getAttachedEnergy().length > 0;
    },
    actions: [new StatusAction(targets.selected, statusEffects.energyBurn)],
  },
  'base1-8': {
    // Machamp
    trigger: 'passive',
    canPlay: (context) => context.player.selected.canUsePokemonPower(),
    actions: [new DamageAction(targets.defender, 10)],
  },
  'base1-15': {
    // Venusaur
    trigger: 'active',
    canPlay: (context) => {
      context.player.selected.canUsePokemonPower() &&
        context.player
          .getDeck(cardGroups.benchPlusActive)
          .some(
            (card) =>
              card instanceof RawEnergyCard && card.name === 'Grass Energy',
          );
    },
    actions: [new CustomAction(customActions.energyTrans)],
  },
  'base1-21': {
    trigger: 'active',
    canPlay: (context) => {
      canUsePokemonPower(sourcePokemon) &&
        context.player.getDeck(cardGroups.benchPlusActive).length >= 2;
    },
    actions: [new CustomAction(customActions.buzzap)],
  },
});
