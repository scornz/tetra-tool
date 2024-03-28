import { getCoords, shuffle } from "@/utils";
import {
  BOARD_COLORS,
  TETROMINO_PREVIEW_SHAPES,
  TetrominoType,
} from "@/game/constants";
import { CanvasEntity, Engine } from "@/game/engine";

class NextQueue extends CanvasEntity {
  /**
   * The current held piece, if there is one.
   */
  private nextPieces: TetrominoType[] = [];

  /**
   * The bag of tetrominos to draw from, this is shuffled and refilled when empty.
   * Allows for classic 7-bag randomization.
   */
  private bag: TetrominoType[] = [];

  private numPreview: number = 5;

  constructor(
    engine: Engine,
    ctx: CanvasRenderingContext2D,
    public readonly size: number
  ) {
    super(engine, ctx);
    this.ctx = ctx;

    for (let i = 0; i < this.numPreview; i++) {
      const piece = this.grab();
      // this.preview.shiftAdd(piece);
      this.nextPieces.push(piece);
    }

    this.draw();
  }

  update(_delta: number): void {}

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
    this.draw();
    return nextPiece;
  }

  draw() {
    // Clear board prior to every draw
    this.clear();

    for (let i = 0; i < this.numPreview; i++) {
      const piece = this.nextPieces[i];
      const shape = TETROMINO_PREVIEW_SHAPES[piece];
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          const cell = shape[y][x];
          if (cell) {
            this.drawCell(x, y + (this.numPreview - i) * 3, cell);
          }
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

  /**
   * @returns The next pieces in the queue
   */
  public getQueue() {
    // Return the next pieces in the queue, copied
    return this.nextPieces.slice();
  }
}

export default NextQueue;
