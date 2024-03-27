import { Engine, GameEntity, InputType, Vector2 } from "@/game/engine";
import {
  I_WALL_KICKS,
  JLTSZ_WALL_KICKS,
  MOVEMENT,
  TETROMINO_SHAPES,
  TetrominoType,
} from "@/game/constants";
import { Board } from ".";
import { TypedEvent } from "@/utils";

class Tetromino extends GameEntity {
  private pos: Vector2 = new Vector2(0, 0);

  /* The rotation of this tetromino
  0 - normal
  1 - 90 degrees
  2 - 180 degrees
  3 - 270 degrees
  */
  private rot: number = 0;

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
    private readonly board: Board,
    public readonly type: TetrominoType,
    private readonly dropInterval: number
  ) {
    super(engine);
    this.pos = this.board.spawnPos;
    // Spawn an I tetromino one block lower
    if (this.type == TetrominoType.I) {
      this.pos = this.pos.add(new Vector2(0, -1));
    }

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
        this.move(0, -1);
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
        moved = this.move(0, -1);
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
        moved = this.move(keyHeld == InputType.MOVE_LEFT ? -1 : 1, 0);
      }
      this.arrTime += delta;
    } else {
      this.arrTime = 0;
    }

    if (this.checkLockDown()) {
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
        this.move(-1, 0);
        break;
      case InputType.MOVE_RIGHT:
        this.move(1, 0);
        break;
      case InputType.ROTATE_LEFT:
        // Handle audio within function
        this.rotate((this.rot + 3) % 4);
        break;
      case InputType.ROTATE_RIGHT:
        this.rotate((this.rot + 1) % 4);
        break;
      case InputType.ROTATE_180:
        // Rotate twice
        this.rotate((this.rot + 1) % 4);
        this.rotate((this.rot + 1) % 4);
        break;
      case InputType.HARD_DROP:
        this.place();
        break;
    }
  }

  /**
   * Check for obstructions, and move the tetromino by the given amount.
   * @param x The amount to move the tetromino in the x direction
   * @param y The amount to move the tetromino in the y direction
   * @returns True if the tetromino was moved, false otherwise
   */
  private move(x: number, y: number): boolean {
    const newPos = new Vector2(x, y).add(this.pos);
    // Check for a collision at the new position
    const collision = this.checkCollision(newPos, this.rot);

    // Do not move if there is a collision at the new position
    if (collision) return false;

    // Set the new position
    this.pos = newPos;
    this.moveCounter++;
    return true;
  }

  /**
   * Rotate the tetromino to the given rotation, if possible. If not possible,
   * then offset using SRS (super rotation system).
   * @param rot The rotation to rotate the tetromino to
   */
  private rotate(rot: number): boolean {
    // We can always "rotate" an O tetromino, it just doesn't really do anything
    if (this.type == TetrominoType.O) {
      return true;
    }

    const offsets =
      this.type == TetrominoType.I
        ? I_WALL_KICKS[this.rot][rot]
        : JLTSZ_WALL_KICKS[this.rot][rot];

    // Check each offset, and succeed at the first non-collision
    for (const offset of offsets) {
      // Check for a collision at the new position
      const newPos = this.pos.add(offset);
      const collision = this.checkCollision(newPos, rot);

      if (collision) continue;

      // No collision!
      this.rot = rot;
      this.pos = newPos;
      this.moveCounter++;
      return true;
    }

    // If NONE succeed, do nothing
    return false;
  }

  /**
   * Check to see if this tetromino would collide with any other cells on the board
   * if it were to be moved to the given position.
   * @param pos The position to check for collision
   * @returns True if there is a collision, false otherwise
   */
  checkCollision(pos: Vector2 = this.pos, rot: number = this.rot): boolean {
    // Check if any of the cells would now be out of bounds
    const positions = this.getBoardPositions(pos, rot);
    for (const pos of positions) {
      // Check if out of bounds
      if (pos.x < 0 || pos.x >= this.board.width) {
        return true;
      }

      // Check to see if the position on the board is filled
      if (this.board.isFilled(pos.x, pos.y)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if the board has blocks immediatley below any of these cells. If so,
   * this should engage a lock down of the tetromino.
   */
  checkLockDown(): boolean {
    const positions = this.getBoardPositions(this.pos, this.rot);
    for (const pos of positions) {
      // Check to see if the position BELOW this cell is filled
      if (this.board.isFilled(pos.x, pos.y - 1)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Based on the position of this tetromino, get the board positions that are
   * occupied by cells.
   * @returns The board positions that this tetromino occupies
   */
  getBoardPositions(
    pos: Vector2 = this.pos,
    rot: number = this.rot
  ): Vector2[] {
    const shape = TETROMINO_SHAPES[this.type][rot];
    const positions: Vector2[] = [];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] != 0) {
          positions.push(new Vector2(x, y).add(pos));
        }
      }
    }
    return positions;
  }

  /**
   * Based on the position of this tetromino, get the board positions that this
   * tetromino would occupy if it were hard dropped.
   * @returns The board positions that this tetromino occupies
   */
  getGhostPositions(): Vector2[] {
    let ghostPos = new Vector2(this.pos.x, this.pos.y);
    while (!this.checkCollision(ghostPos.add(new Vector2(0, -1)), this.rot)) {
      // Move ghost position down until there is a collision
      ghostPos = ghostPos.add(new Vector2(0, -1));
    }
    return this.getBoardPositions(ghostPos, this.rot);
  }

  /**
   * Shift the tetromino down by 1 unit until there is a collision, then place the
   * tetromino on the board.
   */
  place(): void {
    // Keep moving until the piece stops
    let dropped = 0;
    while (this.move(0, -1)) {
      dropped++;
    }

    // Place the tetromino on the board
    this.board.place(this);
    // Emit the placed event
    this.placed.emit();
    this.placed.clear();
  }

  destroy(): void {
    super.destroy();
    // Remove event listeners
    this.engine.input.removeListener(this.handleInputCallback);
  }
}

export default Tetromino;
