import { getCoords } from "@/utils";
import { BOARD_COLORS, TESTING_LAYOUT, TetrominoType } from "@/game/constants";
import { CanvasEntity, Engine, Vector2 } from "@/game/engine";
import Tetromino from "./Tetromino";

class Board extends CanvasEntity {
  /**
   * Layout of the overall board
   * 0 represents an empty square
   * 1-7 represent filled squares, each with different colors
   * 1 - I (light blue), 2 - O (yellow), 3 - T (pink), 4 - J (blue), 5 - L (orange),
   * 6 - S (green), 7 - Z (red)
   */
  private layout: number[][];

  /**
   * The cells occupied by the piece that is currently being controlled.
   */
  private movingCells: Vector2[] | null = null;

  constructor(
    engine: Engine,
    ctx: CanvasRenderingContext2D,
    public readonly width: number = 10,
    public readonly height: number = 30,
    private readonly visibleHeight: number = 20,
    testing: boolean = false
  ) {
    super(engine, ctx);
    this.ctx = ctx;
    this.layout = !testing
      ? Array.from(Array(height), (_) => Array(width).fill(0))
      : TESTING_LAYOUT;
  }
  update(_delta: number): void {}

  draw() {
    // Clear board prior to every draw
    this.clear();

    // Number of pixels per cell, assume that they are square
    const cellSize = this.ctx.canvas.width / this.width;

    for (let y = 0; y < this.visibleHeight; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.layout[y][x];
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
  private drawCell = (
    x: number,
    y: number,
    type: TetrominoType,
    clear: boolean = false
  ) => {
    const cellSize = this.ctx.canvas.width / this.width;
    const coords = getCoords(this.ctx.canvas, x * cellSize, y * cellSize);
    if (!clear) {
      this.ctx.fillStyle = BOARD_COLORS[type];
      // Draw with negative cell y-size because the y-axis is inverted
      this.ctx.fillRect(coords.x, coords.y, cellSize, -cellSize);
    } else {
      this.ctx.clearRect(coords.x, coords.y, cellSize, -cellSize);
    }
  };

  /**
   * Draw/clear the cells that a tetromino occupies
   * @param tetromino The tetromino to draw
   * @param clear Whether to clear the tetromino
   */
  private drawTetromino = (tetromino: Tetromino, clear: boolean = false) => {
    const positions = tetromino.getBoardPositions();
    positions.forEach((pos) => {
      this.drawCell(pos.x, pos.y, tetromino.type, clear);
    });
  };

  /**
   * Add a tetromino to the board
   * @param tetromino The tetromino to add
   */
  updateTetromino(tetromino: Tetromino) {
    if (this.movingCells) {
      // Clear out all previous moving cells
      for (const pos of this.movingCells) {
        this.drawCell(pos.x, pos.y, 8, true);
      }
    }

    // Draw the current position of this cell
    this.drawTetromino(tetromino);
  }
}

export default Board;
