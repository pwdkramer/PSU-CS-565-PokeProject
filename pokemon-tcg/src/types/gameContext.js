export default class GameContext {
  game = null; // GameEngine
  player = null; // ('./player.js').Player
  opponent = null; // ('./player.js').Player

  attacker = null;
  defender = null;
  selected = null;

  constructor({ game, player, opponnet, selected }) {
    this.game = game;
    this.player = player;
    this.opponent = this.opponent;

    this.attacker = player.getActiveCard(); // active attacking card
    this.defender = opponnet.getActiveCard(); // active defending card

    this.selected = this.selected; // the currently selected card
  }
}
