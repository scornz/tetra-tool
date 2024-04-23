import { getCoords } from "@/utils";
import { BOARD_COLORS, TESTING_LAYOUT, TetrominoType } from "@/game/constants";
import { CanvasEntity, Engine, Vector2 } from "@/game/engine";
import { Board, Tetromino } from "@/game/objects";
import { TetrominoEntity } from ".";

class BoardEntity extends CanvasEntity {
  private board: Board;

  /**
   * The current falling tetromino, if there is one.
   */
  private _tetromino: TetrominoEntity | null = null;
  get tetromino(): TetrominoEntity | null {
    return this._tetromino;
  }

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

    this.board = new Board(
      width,
      height,
      !testing
        ? Array.from(Array(height), (_) => Array(width).fill(0))
        : TESTING_LAYOUT
    );
  }

  update(_delta: number): void {
    this.draw();
  }

  draw() {
    // Clear board prior to every draw
    this.clear();

    // Draw grid
    // Calculate cell size based on the canvas dimensions and board width
    const cellSize = this.ctx.canvas.width / this.width;

    // Draw grid
    this.ctx.strokeStyle = "#aaaaaa"; // Light grey color for grid lines
    for (let y = 0; y < this.visibleHeight; y++) {
      for (let x = 0; x < this.width; x++) {
        this.ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    for (let y = 0; y < this.visibleHeight; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.board.getCell(x, y);
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

  createTetromino(type: TetrominoType): Tetromino {
    return new Tetromino(this.board, type, this.spawnPos);
  }

  /**
   * Update the active tetromino of the board, if it exists.
   * @param tetromino The tetromino to set
   */
  setTetromino(tetromino: TetrominoEntity): void {
    if (this.tetromino) {
      // Destroy the existing tetromino if it exists
      this.tetromino.destroy();
    }

    this._tetromino = tetromino;
  }

  place(tetromino: TetrominoEntity): void {
    // Remove this tetromino from the scene
    tetromino.destroy();
    this._tetromino = null;
  }

  /**
   * Draw a cell on the board
   * @param x The x position of the cell
   * @param y The y position of the cell
   * @param type The type of tetromino to draw
   * @param clear Whether to clear the cell
   */
  protected drawCell = (
    x: number,
    y: number,
    type: TetrominoType,
    transparency: string = "FF",
    includeX: boolean = false
  ) => {
    const cellSize = this.ctx.canvas.width / this.width;
    const coords = getCoords(this.ctx.canvas, x * cellSize, y * cellSize);
    this.ctx.fillStyle = BOARD_COLORS[type];

    this.ctx.fillStyle += transparency; // add transparency to the color

    // Draw with negative cell y-size because the y-axis is inverted
    this.ctx.fillRect(coords.x, coords.y, cellSize, -cellSize);

    if (includeX) {
      // Put a dot in the center of the cell
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(coords.x + cellSize / 2, coords.y - cellSize / 2, 4, 4);
    }
  };

  /**
   * Draw/clear the cells that a tetromino occupies
   * @param tetromino The tetromino to draw
   * @param clear Whether to clear the tetromino
   */
  private drawTetromino = (tetromino: TetrominoEntity) => {
    const positions = tetromino.getBoardPositions();
    positions.forEach((pos) => {
      this.drawCell(pos.x, pos.y, tetromino.type);
    });

    const ghostPositions = tetromino.getGhostPositions();
    ghostPositions.forEach((pos) => {
      this.drawCell(pos.x, pos.y, tetromino.type, "4D");
    });
  };

  /**
   * @returns The layout of the board
   */
  getLayout(): number[][] {
    return this.board.getLayout();
  }
}

export default BoardEntity;
