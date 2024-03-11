import { getCoords } from "@/utils";
import { BOARD_COLORS, TESTING_LAYOUT } from "@/game/constants";
import { CanvasEntity, Engine } from "@/game/engine";

class Board extends CanvasEntity {
  /**
   * Layout of the overall board
   * 0 represents an empty square
   * 1-7 represent filled squares, each with different colors
   * 1 - I (light blue), 2 - O (yellow), 3 - T (pink), 4 - J (blue), 5 - L (orange),
   * 6 - S (green), 7 - Z (red)
   */
  private layout: number[][];

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
          this.ctx.fillStyle = BOARD_COLORS[cell];
          const coords = getCoords(this.ctx.canvas, x * cellSize, y * cellSize);
          // Draw with negative cell y-size because the y-axis is inverted
          this.ctx.fillRect(coords.x, coords.y, cellSize, -cellSize);
        }
      }
    }
  }

  // Add methods to manipulate the context here
}

export default Board;
