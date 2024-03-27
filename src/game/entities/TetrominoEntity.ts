import { Engine, GameEntity, InputType, Vector2 } from "@/game/engine";
import { MOVEMENT, TetrominoType } from "@/game/constants";
import { TypedEvent } from "@/utils";
import { Tetromino, Board } from "@/game/objects";
import { BoardEntity } from ".";

class TetrominoEntity extends GameEntity {
  private tetromino: Tetromino;

  private dropTime: number = 0;
  private softDropTime: number = 0;

  private lockDownTime: number = 0;
  private arrTime: number = MOVEMENT.ARR;

  // Move counters used for lock down timer
  private moveCounter: number = 0;
  private prevMoveCounter: number = 0;

  // Callback for handling movement, store this for later removal
  private handleInputCallback: (input: InputType) => void;

  /**
   * Event that is emitted when this tetromino is placed on the board.
   */
  public readonly placed: TypedEvent<void> = new TypedEvent();

  constructor(
    engine: Engine,
    private readonly board: BoardEntity,
    public readonly type: TetrominoType,
    private readonly dropInterval: number
  ) {
    super(engine);
    this.tetromino = board.createTetromino(type);

    this.handleInputCallback = this.handleInput.bind(this);
    this.engine.input.addListener(this.handleInputCallback);
  }

  update(delta: number): void {
    this.dropTime += delta;

    const [keyHeld, keyHeldTime] = this.engine.input.getHeldKey();

    // Handle falling of tetromino, use soft drop speed if soft drop key is held
    if (this.dropTime > this.dropInterval) {
      // Keep moving down one block until the time is made up
      while (this.dropTime > this.dropInterval) {
        this.dropTime -= this.dropInterval;
        this.tetromino.move(0, -1);
      }
    }
    // Only allow soft dropping when game speed is slower than soft drop seed
    else if (
      this.dropInterval > MOVEMENT.SD &&
      keyHeld == InputType.SOFT_DROP
    ) {
      this.dropTime = 0;
      this.softDropTime += delta;
      let moved = true;
      // Drop multiple rows if necessary
      while (this.softDropTime > MOVEMENT.SD && moved) {
        this.softDropTime -= MOVEMENT.SD;
        moved = this.tetromino.move(0, -1);
      }
    }

    // Reset soft drop time when key is released
    if (keyHeld != InputType.SOFT_DROP) {
      this.softDropTime = 0;
    }

    // If the held key is movement to the right or left
    if (
      (keyHeld == InputType.MOVE_LEFT || keyHeld == InputType.MOVE_RIGHT) &&
      keyHeldTime > MOVEMENT.DAS
    ) {
      let moved = true;
      // Move the tetromino by 1 unit (could be multiple frames)
      // Stop if ARR time stops, or moved is false
      while (this.arrTime > MOVEMENT.ARR && moved) {
        this.arrTime -= MOVEMENT.ARR;
        moved = this.tetromino.move(keyHeld == InputType.MOVE_LEFT ? -1 : 1, 0);
      }
      this.arrTime += delta;
    } else {
      this.arrTime = 0;
    }

    if (this.tetromino.checkLockDown()) {
      // Reset the counter if the tetromino has been moved and is less than max moves
      if (
        this.moveCounter != this.prevMoveCounter &&
        this.moveCounter <= MOVEMENT.MAX_MOVE_LOCK_DOWN
      ) {
        this.prevMoveCounter = this.moveCounter;
        this.lockDownTime = 0;
      }

      this.lockDownTime += delta;
      if (this.lockDownTime > 0.5) {
        // Lock down the tetromino
        this.place();
        // Return early, no need to update the cell positions
        return;
      }
    } else {
      // Reset move counters
      this.moveCounter = 0;
      this.prevMoveCounter = 0;
    }
  }

  /**
   * Handles input and specialized audio for input feedback
   */
  handleInput(input: InputType): void {
    // Go through available input and handle accordingly
    switch (input) {
      case InputType.MOVE_LEFT:
        this.tetromino.move(-1, 0);
        break;
      case InputType.MOVE_RIGHT:
        this.tetromino.move(1, 0);
        break;
      case InputType.ROTATE_LEFT:
        // Handle audio within function
        this.tetromino.rotate(-1);
        break;
      case InputType.ROTATE_RIGHT:
        this.tetromino.rotate(1);
        break;
      case InputType.ROTATE_180:
        // Rotate twice
        this.tetromino.rotate(1);
        this.tetromino.rotate(1);
        break;
      case InputType.HARD_DROP:
        this.place();
        break;
    }
  }

  /**
   * Shift the tetromino down by 1 unit until there is a collision, then place the
   * tetromino on the board.
   */
  place(): void {
    this.tetromino.place();
    this.board.place(this);
    // Emit the placed event
    this.placed.emit();
    this.placed.clear();
  }

  getBoardPositions(): Vector2[] {
    return this.tetromino.getBoardPositions();
  }

  getGhostPositions(): Vector2[] {
    return this.tetromino.getGhostPositions();
  }

  checkCollision(): boolean {
    return this.tetromino.checkCollision();
  }

  destroy(): void {
    super.destroy();
    // Remove event listeners
    this.engine.input.removeListener(this.handleInputCallback);
  }
}

export default TetrominoEntity;
