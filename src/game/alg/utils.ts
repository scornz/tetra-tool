import { Board, Tetromino } from "../objects";

/**
 * A set of board layouts.
 */
export class LayoutSet {
  private set: Set<string> = new Set<string>();
  private layouts: number[][][] = [];

  public add(layout: number[][]): void {
    // Get the hash for this layout
    const hash = hashLayout(layout);
    if (this.set.has(hash)) return;

    this.set.add(hash);
    this.layouts.push(layout);
  }

  public size(): number {
    return this.set.size;
  }

  public values(): number[][][] {
    return this.layouts;
  }
}

export class TetrominoStack {
  private set: Set<string> = new Set<string>();
  private stack: Tetromino[] = [];

  /**
   * Add a tetromino to the stack, only if it is unique.
   * @param tetromino The tetromino to add to the stack
   * @returns
   */
  public add(tetromino: Tetromino): void {
    // Get the hash for this layout
    const hash = hashTetromino(tetromino);
    if (this.set.has(hash)) return;

    this.set.add(hash);
    this.stack.push(tetromino.clone().clone().clone());
  }

  /**
   * @returns The next tetromino in the stack, or undefined if the stack is empty.
   */
  public pop(): Tetromino | undefined {
    return this.stack.pop();
  }

  /**
   * @returns The number of tetrominos in the stack
   */
  public size(): number {
    return this.stack.length;
  }
}

/**
 * Hash a layout to a unique string.
 * @param layout The layout to hash
 * @returns A unique hash for the layout, based on the filled positions
 */
const hashLayout = (layout: number[][]): string => {
  let hash = "";
  // Iterate through the matrix to build a binary string
  layout.forEach((row) => {
    let rowBinaryString = "";
    row.forEach((cell) => {
      // Add '1' for filled positions and '0' for unfilled
      rowBinaryString += cell !== 0 ? "1" : "0";
    });
    // Convert the binary row string to hexadecimal and concatenate
    hash += parseInt(rowBinaryString, 2).toString(16);
  });
  return hash;
};

/**
 * Hash a tetromino to a unique string.
 * @param tetromino The tetromino to hash
 * @returns A unique hash for the tetromino, based on its position and rotation.
 */
function hashTetromino(tetromino: Tetromino): string {
  // Serialize the object values
  const serialized = `${tetromino.position.x}_${tetromino.position.y}_${tetromino.rotation}`;
  // Convert the serialized string to a hexadecimal representation
  let hexString = "";
  for (let i = 0; i < serialized.length; i++) {
    // Convert each character to its ASCII value, then to a hexadecimal string
    hexString += serialized.charCodeAt(i).toString(16);
  }

  return hexString;
}

export const placeOnBoard = (
  tetromino: Tetromino,
  board: Board
): number[][] => {
  const clonedBoard = board.clone();
  clonedBoard.place(tetromino);
  return clonedBoard.getLayout();
};
