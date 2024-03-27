import { Engine, GameEntity, InputType } from "@/game/engine";
import { Board, Hold, NextQueue, Tetromino } from ".";
import { TetrominoType } from "../constants";

class Game extends GameEntity {
  speed: number = 1;
  /*
   * Whether the hold has already been used this turn
   */
  private alreadyHeld: boolean = false;

  // Callback for handling movement, store this for later removal
  private handleInputCallback: (input: InputType) => void;

  constructor(
    engine: Engine,
    private readonly board: Board,
    private readonly hold: Hold,
    private readonly next: NextQueue
  ) {
    super(engine);
    this.handleInputCallback = this.handleInput.bind(this);
    this.engine.input.addListener(this.handleInputCallback);

    // Start the game
    // NOTE: This should be removed for another start method of some sort
    this.spawnNext();
  }

  /**
   * Handles input and specialized audio for input feedback
   */
  handleInput(input: InputType): void {
    // Only allow a quick reset a second after the game has started
    // if (input == InputType.QUICK_RESET && this.active && this.timer > 1) {
    //   this.active = false;
    //   // Quickly reload the scene, resetting the game
    //   beginGame();
    // }
    if (input == InputType.HOLD && !this.alreadyHeld) {
      if (this.hold.piece) {
        // If there is already a held tetromino, then swap it with the current
        const temp = this.hold.piece;
        this.hold.set(this.board.tetromino!.type);
        this.board.tetromino!.destroy();
        this.spawn(temp);
      } else {
        // If there is no held tetromino, then simply hold the current one
        this.hold.set(this.board.tetromino!.type);
        this.board.tetromino?.destroy();
        this.spawnNext();
      }
      // Prevent user from holding another piece until another one spawns
      this.alreadyHeld = true;
    }
  }

  /**
   * Spawns the next piece in the sequence into the game
   */
  spawnNext() {
    const piece = this.next.getNextPiece();
    this.spawn(piece);
  }

  /**
   * Spawns a tetromino into the game.
   * @param type The tetromino to spawn
   */
  spawn(type: TetrominoType) {
    const tetromino = new Tetromino(this.engine, this.board, type, this.speed);
    // If this tetromino collides with the board, then the game is over
    if (tetromino.checkCollision()) {
      // Immediatley destroy the tetromino
      tetromino.destroy();
      // GAME OVER
      return;
    }

    this.board.setTetromino(tetromino);
    // Spawn the next tetromino when this one is placed
    tetromino.placed.on(
      (() => {
        // When this is placed, spawn the next tetromino
        this.spawnNext();
        // Allow the user to hold another piece
        this.alreadyHeld = false;
      }).bind(this),
      this
    );
  }

  update(_delta: number): void {}
}

export default Game;
