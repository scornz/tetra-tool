import { Engine, GameEntity, InputType } from "@/game/engine";
import { Board, Tetromino } from ".";
import { TetrominoType } from "../constants";

class Game extends GameEntity {
  // Callback for handling movement, store this for later removal
  private handleInputCallback: (input: InputType) => void;

  constructor(engine: Engine, private readonly board: Board) {
    super(engine);
    this.handleInputCallback = this.handleInput.bind(this);
    this.engine.input.addListener(this.handleInputCallback);
  }
  update(_delta: number): void {}

  /**
   * Handles input and specialized audio for input feedback
   */
  handleInput(input: InputType): void {
    // Go through available input and handle accordingly
    switch (input) {
      case InputType.QUICK_RESET:
        this.board.tetromino = new Tetromino(
          this.engine,
          this.board,
          TetrominoType.J
        );
        break;
    }
  }
}

export default Game;
