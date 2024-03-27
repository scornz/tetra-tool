import { Vector2 } from "@/game/engine";
import Tetromino from "./Tetromino";

class Board {
  /**
   * Layout of the overall board
   * 0 represents an empty square
   * 1-7 represent filled squares, each with different colors
   * 1 - I (light blue), 2 - O (yellow), 3 - T (pink), 4 - J (blue), 5 - L (orange),
   * 6 - S (green), 7 - Z (red)
   */
  private layout: number[][];

  /**
   * Spawn position of the tetromino
   */
  public spawnPos: Vector2 = new Vector2(3, 18);

  constructor(
    public readonly width: number = 10,
    public readonly height: number = 30,
    initialLayout: number[][] = []
  ) {
    this.layout =
      initialLayout.length > 0
        ? initialLayout
        : Array.from(Array(height), (_) => Array(width).fill(0));
  }

  /**
   * Returns true if the given position has a cell (a non-zero value in it).
   */
  isFilled(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0) return true;

    return this.layout[y][x] != 0;
  }

  /**
   * Get the cell at the given position.
   */
  getCell(x: number, y: number): number {
    return this.layout[y][x];
  }

  place(tetromino: Tetromino): void {
    const positions = tetromino.getBoardPositions();
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      this.layout[pos.y][pos.x] = tetromino.type;
    }
    // Check cleared lines
    const cleared = this.checkLines();
  }

  /**
   * Check if any lines have been completed, and if so, remove them and shift the
   * blocks above them appropriately. Return number of lines cleared.
   */
  checkLines(): number {
    let cleared = 0;
    for (let y = 0; y < this.layout.length; y++) {
      let filled = true;
      // If any of the cells in this line are empty, then this line is not filled
      for (let x = 0; x < this.layout[y].length; x++) {
        if (this.layout[y][x] == 0) {
          filled = false;
          break;
        }
      }

      if (!filled) continue;

      // Remove this line from layout and cells
      this.layout.splice(y, 1);
      // Replace new line of zeroes and null values along the top
      this.layout.push(Array(this.width).fill(0));
      // Check this line again since everything just shifted down
      y--;
      cleared++;
    }

    return cleared;
  }
}

export default Board;
