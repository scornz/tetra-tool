import { Engine, GameEntity, Vector2 } from "@/game/engine";
import { TETROMINO_SHAPES, TetrominoType } from "@/game/constants";
import { Board } from ".";

class Tetromino extends GameEntity {
  private pos: Vector2 = new Vector2(0, 0);

  /* The rotation of this tetromino
  0 - normal
  1 - 90 degrees
  2 - 180 degrees
  3 - 270 degrees
  */
  private rot: number = 0;

  constructor(
    engine: Engine,
    private readonly board: Board,
    public readonly type: TetrominoType
  ) {
    super(engine);
  }
  update(_delta: number): void {}

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
}

export default Tetromino;
