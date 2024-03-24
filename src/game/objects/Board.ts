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
   * The current falling tetromino, if there is one.
   */
  private tetromino: Tetromino | null = null;

  /**
   * Spawn position of the tetromino
   */
  public spawnPos: Vector2 = new Vector2(3, 18);

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

  update(_delta: number): void {
    this.draw();
  }

  draw() {
    // Clear board prior to every draw
    this.clear();
    for (let y = 0; y < this.visibleHeight; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.layout[y][x];
        if (cell) {
          this.drawCell(x, y, cell);
        }
      }
    }

    // Draw the active tetromino if it exists
    if (this.tetromino) {
      this.drawTetromino(this.tetromino);
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
    const cellSize = this.ctx.canvas.width / this.width;
    const coords = getCoords(this.ctx.canvas, x * cellSize, y * cellSize);
    this.ctx.fillStyle = BOARD_COLORS[type];
    // Draw with negative cell y-size because the y-axis is inverted
    this.ctx.fillRect(coords.x, coords.y, cellSize, -cellSize);
  };

  /**
   * Draw/clear the cells that a tetromino occupies
   * @param tetromino The tetromino to draw
   * @param clear Whether to clear the tetromino
   */
  private drawTetromino = (tetromino: Tetromino) => {
    const positions = tetromino.getBoardPositions();
    positions.forEach((pos) => {
      this.drawCell(pos.x, pos.y, tetromino.type);
    });
  };

  /**
   * Returns true if the given position has a cell (a non-zero value in it).
   */
  isFilled(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0) return true;

    return this.layout[y][x] != 0;
  }

  /**
   * Update the active tetromino of the board, if it exists.
   * @param tetromino The tetromino to set
   */
  setTetromino(tetromino: Tetromino): void {
    if (this.tetromino) {
      // Destroy the existing tetromino if it exists
      this.tetromino.destroy();
    }

    this.tetromino = tetromino;
  }

  place(tetromino: Tetromino): void {
    const positions = tetromino.getBoardPositions();
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      this.layout[pos.y][pos.x] = tetromino.type;
    }
    // Remove this tetromino from the scene
    tetromino.destroy();
    this.tetromino = null;
  }
}

export default Board;
