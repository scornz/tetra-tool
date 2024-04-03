import { Vector2 } from "@/game/engine";
import {
  I_WALL_KICKS,
  JLTSZ_WALL_KICKS,
  TETROMINO_SHAPES,
  TetrominoType,
} from "@/game/constants";
import { Board } from ".";

class Tetromino {
  private pos: Vector2 = new Vector2(0, 0);
  get position(): Vector2 {
    return this.pos;
  }

  /* The rotation of this tetromino
  0 - normal
  1 - 90 degrees
  2 - 180 degrees
  3 - 270 degrees
  */
  private rot: number = 0;
  get rotation(): number {
    return this.rot;
  }

  constructor(
    private readonly board: Board,
    public readonly type: TetrominoType,
    pos: Vector2 = new Vector2(0, 0),
    rot: number = 0
  ) {
    this.pos = pos;
    this.rot = rot;
    // Spawn an I tetromino one block lower
    if (this.type == TetrominoType.I) {
      this.move(0, -1);
    }
  }

  /**
   * Check for obstructions, and move the tetromino by the given amount.
   * @param x The amount to move the tetromino in the x direction
   * @param y The amount to move the tetromino in the y direction
   * @returns True if the tetromino was moved, false otherwise
   */
  public move(x: number, y: number): boolean {
    const newPos = new Vector2(x, y).add(this.pos);
    // Check for a collision at the new position
    const collision = this.checkCollision(newPos, this.rot);
    // Do not move if there is a collision at the new position
    if (collision) return false;

    // Set the new position
    this.pos = newPos;
    return true;
  }

  /**
   * Rotate the tetromino to the given rotation, if possible. If not possible,
   * then offset using SRS (super rotation system).
   * @param rot The rotation to rotate the tetromino to
   */
  public rotate(dir: number): boolean {
    // We can always "rotate" an O tetromino, it just doesn't really do anything
    if (this.type == TetrominoType.O) {
      return true;
    }

    // Get the new rotation from dir
    const rot = (this.rot + dir + 4) % 4;

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
  }

  /**
   * Get a clone of this tetromino. If provided, clone it on to `board`.
   */
  clone(board: Board = this.board): Tetromino {
    return new Tetromino(board, this.type, this.pos, this.rot);
  }
}

export default Tetromino;
