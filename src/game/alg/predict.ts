import { Board, Tetromino } from "@/game/objects";
import { TESTING_LAYOUT, TetrominoType } from "@/game/constants";
import { Vector2 } from "../engine";
import { LayoutSet, TetrominoStack, placeOnBoard } from ".";

/**
 * The maximum number of possible board states to predict. This is to prevent
 * infinite loops and to keep the prediction time reasonable. If the limit is
 * reached, a warning is logged to the console.
 */
const PREDICTION_LIMIT = 100;

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

  // A set of unique layouts (board states)
  const layouts = new LayoutSet();
  const stack = new TetrominoStack();

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
      if (!tetromino.checkCollision()) stack.add(tetromino);
    }
  }

  // Keep going until the stack is empty, meaning all possibilities are explored
  while (stack.size() !== 0 && layouts.size() < PREDICTION_LIMIT) {
    console.log(stack);
    const tetromino = stack.pop()!.clone();
    // if (tetromino.checkCollision()) continue;

    if (tetromino.checkLockDown()) {
      // Place the tetromino on the board
      layouts.add(placeOnBoard(tetromino, board));
    }

    // Move the tetromino down by 1 unit
    tetromino.move(0, -1);
    stack.add(tetromino);

    // Create three clones of the tetromino in an array
    const rotations = {
      left: tetromino.clone(),
      right: tetromino.clone(),
      flipped: tetromino.clone(),
    };
    rotations.left.rotate(-1);
    rotations.right.rotate(1);
    // Rotate right twice
    rotations.flipped.rotate(1);
    rotations.flipped.rotate(1);

    Object.values(rotations).forEach((rotated) => {
      stack.add(rotated);
    });
  }

  if (layouts.size() >= PREDICTION_LIMIT) {
    console.warn(
      `Prediction limit reached (${PREDICTION_LIMIT}). Some possibilities may be missed.`
    );
  }

  // Return all layouts in the set
  return layouts.values();
};
