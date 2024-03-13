import { Engine, GameEntity } from "@/game/engine";
import { Board } from ".";

class Game extends GameEntity {
  constructor(engine: Engine, private readonly board: Board) {
    super(engine);
  }
  update(_delta: number): void {}

  // Add methods to manipulate the context here
}

export default Game;
