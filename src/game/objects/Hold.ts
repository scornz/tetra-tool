import { getCoords } from "@/utils";
import {
  BOARD_COLORS,
  TETROMINO_PREVIEW_SHAPES,
  TetrominoType,
} from "@/game/constants";
import { CanvasEntity, Engine } from "@/game/engine";

class Hold extends CanvasEntity {
  /**
   * The current held piece, if there is one.
   */
  private _piece: TetrominoType | null = null;
  get piece(): TetrominoType | null {
    return this._piece;
  }

  constructor(engine: Engine, ctx: CanvasRenderingContext2D) {
    super(engine, ctx);
    this.ctx = ctx;
  }

  update(_delta: number): void {}

  set(type: TetrominoType) {
    this._piece = type;
    this.draw();
  }

  draw() {
    // Clear board prior to every draw
    this.clear();

    if (!this.piece) return;

    const shape = TETROMINO_PREVIEW_SHAPES[this.piece];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        const cell = shape[y][x];
        if (cell) {
          this.drawCell(x, y, cell);
        }
      }
    }
  }

  /**
   * Draw a cell on the board
   * @param x The x position of the cell
   * @param y The y position of the cell
   * @param type The type of tetromino to draw
   * @param clear Whether to clear the cell
   */
  private drawCell = (x: number, y: number, type: TetrominoType) => {
    const cellSize = this.ctx.canvas.width / 4;
    const coords = getCoords(this.ctx.canvas, x * cellSize, y * cellSize);
    this.ctx.fillStyle = BOARD_COLORS[type];
    // Draw with negative cell y-size because the y-axis is inverted
    this.ctx.fillRect(coords.x, coords.y, cellSize, -cellSize);
  };
}

export default Hold;
