import { Engine } from "@/game/engine";
import { Tetromino } from "@/game/objects";
import { BoardEntity } from ".";

class PredictBoardEntity extends BoardEntity {
  /**
   * The best move to make for the current tetromino
   */
  private bestMove: Tetromino | null = null;

  constructor(
    engine: Engine,
    ctx: CanvasRenderingContext2D,
    public readonly width: number = 10,
    public readonly height: number = 30,
    visibleHeight: number = 20,
    testing: boolean = false
  ) {
    super(engine, ctx, width, height, visibleHeight, testing);
  }

  draw() {
    // Draw from the parent class, which clears the board and draws the cells
    super.draw();
    // Draw the best possible move for the current tetromino
    if (this.bestMove) {
      this.drawBestMove(this.bestMove);
    }
  }

  /**
   * Set the best move for the current tetromino
   * @param move The best move to make
   */
  setBestMove(move: Tetromino): void {
    this.bestMove = move;
  }

  /**
   * Draw/clear the cells that a tetromino occupies
   * @param tetromino The tetromino to draw
   * @param clear Whether to clear the tetromino
   */
  private drawBestMove = (tetromino: Tetromino) => {
    const ghostPositions = tetromino.getGhostPositions();
    ghostPositions.forEach((pos) => {
      this.drawCell(pos.x, pos.y, tetromino.type, "3d", true);
    });
  };
}

export default PredictBoardEntity;
