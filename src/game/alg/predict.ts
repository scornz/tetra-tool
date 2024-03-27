import { Board, Tetromino } from "@/game/objects";
import { TetrominoType } from "@/game/constants";
import { Vector2 } from "../engine";
import { LayoutSet } from ".";

/**
 * Given a board state and a tetromino, get the set of all possible board states
 * that could result from placing the tetromino. This includes all hard-drop possibilities,
 * soft-drop, and all possible rotations.
 * @param board The current board state
 * @param tetromino The next tetromino to place
 * @returns A set of possible boards that could result from placing the tetromino
 */
export const getPossibleBoards = (
  layout: number[][],
  tetrominoType: TetrominoType
): number[][][] => {
  // Create a board with this layout
  const board = new Board(layout[0].length, layout.length, layout);

  // Stack of tetrominos to explore
  const stack: Tetromino[] = [];
  // A set of unique layouts (board states)
  const layouts = new LayoutSet();

  // Let's initialize the board, start with each rotation type
  for (let i = 0; i < 4; i++) {
    // Minimum position of tetrominos is -1, and maximum is width - 2 inclusive
    // For a 10-width board, this means the minimum x is -1, and the maximum x is 8
    for (let x = -1; x < board.width - 1; x++) {
      const tetromino = new Tetromino(
        board,
        tetrominoType,
        new Vector2(x, board.spawnPos.y),
        i
      );
      if (!tetromino.checkCollision()) stack.push(tetromino);
    }
  }

  // Keep going until the stack is empty, meaning all possibilities are explored
  while (stack) {}

  // Return all layouts in the set
  return layouts.values();
};
