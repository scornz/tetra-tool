import { getCoords } from "@/utils";
import { BOARD_COLORS, TetrominoType } from "@/game/constants";
import { CanvasEntity, Engine } from "@/game/engine";
import { Tetromino } from "@/game/objects";
import { PossibleLayoutMove } from "@/game/alg";

class PredictMoveEntity extends CanvasEntity {
  private move: PossibleLayoutMove | null = null;

  constructor(
    engine: Engine,
    ctx: CanvasRenderingContext2D,
    public readonly width: number = 10,
    public readonly height: number = 30,
    private readonly visibleHeight: number = 20
  ) {
    super(engine, ctx);
    this.ctx = ctx;
  }

  /**
   * Set the move for the current tetromino, and draw it.
   * @param move The move to display
   */
  setMove(move: PossibleLayoutMove): void {
    this.move = move;
    this.draw();
  }

  update(_delta: number): void {}

  draw() {
    // Clear board prior to every draw
    this.clear();

    if (!this.move) return;

    for (let y = 0; y < this.visibleHeight; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.move.board[y][x];
        if (cell) {
          this.drawCell(x, y, cell);
        }
      }
    }

    this.drawTetromino(this.move.tetromino);
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
    transparency: string = "FF"
  ) => {
    const cellSize = this.ctx.canvas.width / this.width;
    const coords = getCoords(this.ctx.canvas, x * cellSize, y * cellSize);
    this.ctx.fillStyle = BOARD_COLORS[type];

    this.ctx.fillStyle += transparency; // add transparency to the color

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
      this.drawCell(pos.x, pos.y, tetromino.type, "4D");
    });
  };
}

export default PredictMoveEntity;
