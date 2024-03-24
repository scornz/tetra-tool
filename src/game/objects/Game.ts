import { Engine, GameEntity, InputType } from "@/game/engine";
import { Board, Tetromino } from ".";
import { TetrominoType } from "../constants";
import { shuffle } from "@/utils";

class Game extends GameEntity {
  speed: number = 1;

  private nextPieces: TetrominoType[] = [];
  private bag: TetrominoType[] = [];

  private numPreview: number = 5;

  // Callback for handling movement, store this for later removal
  private handleInputCallback: (input: InputType) => void;

  constructor(engine: Engine, private readonly board: Board) {
    super(engine);
    this.handleInputCallback = this.handleInput.bind(this);
    this.engine.input.addListener(this.handleInputCallback);

    for (let i = 0; i < this.numPreview; i++) {
      const piece = this.grab();
      // this.preview.shiftAdd(piece);
      this.nextPieces.push(piece);
    }
  }

  /**
   * Handles input and specialized audio for input feedback
   */
  handleInput(input: InputType): void {
    // Go through available input and handle accordingly
    switch (input) {
      case InputType.QUICK_RESET:
        this.spawn();
        break;
    }
  }

  /**
   * Randomly initalize the bag of tetriminos and filter out the debug value (8)
   */
  fillBag() {
    this.bag = shuffle([
      TetrominoType.I,
      TetrominoType.O,
      TetrominoType.T,
      TetrominoType.J,
      TetrominoType.L,
      TetrominoType.S,
      TetrominoType.Z,
    ]);
  }

  /**
   * Grab the next piece from the bag, and do not replace it until the bag is
   * completely empty.
   * @returns The next tetromino in the bag
   */
  grab(): TetrominoType {
    // Fill bag if the bag is empty
    if (this.bag.length == 0) {
      this.fillBag();
    }
    return this.bag.pop()!;
  }

  /**
   * Used to get the next piece, usually for spawning in.
   * @returns The next piece to spawn in the preview selection
   */
  getNextPiece(): TetrominoType {
    const nextPiece = this.nextPieces.shift()!;

    const newPiece = this.grab();
    this.nextPieces.push(newPiece);
    // this.preview.shiftAdd(newPiece);
    return nextPiece;
  }

  spawn() {
    const piece = this.getNextPiece();
    const tetromino = new Tetromino(this.engine, this.board, piece, this.speed);
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
        this.spawn();
      }).bind(this),
      this
    );
  }

  update(_delta: number): void {}
}

export default Game;
