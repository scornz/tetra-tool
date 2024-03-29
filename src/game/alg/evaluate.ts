import { PossibleLayout } from ".";

/**
 * Given a set of Tetris layouts, this function will evaluate each layout and return the best one.
 * This includes evaluating the height of the layout, the number of holes,
 * the number of cleared lines, and the number of wells.
 * @param layouts The set of Tetris layouts to evaluate
 * @returns
 */
export const findBestLayout = (layouts: PossibleLayout[]): PossibleLayout => {
  let bestLayout = layouts[0];
  let bestScore = evaluateLayout(bestLayout.board);

  for (let i = 1; i < layouts.length; i++) {
    const layout = layouts[i];
    const score = evaluateLayout(layout.board);

    if (score < bestScore) {
      bestLayout = layout;
      bestScore = score;
    }
  }

  return bestLayout;
};

/**
 * Evaluates a Tetris layout based on the flatness. A lower score is better.
 * @param layout The Tetris layout to evaluate
 * @returns
 */
const evaluateLayout = (layout: number[][]): number => {
  // const flatness = evaluateFlatness(layout);
  // const holes = evaluateHoles(layout);

  /* Find the column with the maximum height, return that maximum height */
  // Lower maximum height is better
  const maxHeight = evaluateHeight(layout);
  const flatness = evaluateFlatness(layout);
  const holes = evaluateHoles(layout);

  return holes + flatness + 3 * maxHeight;
};

/**
 * Evaluates the flatness of a Tetris layout. This involves comparing neighboring
 * columns together and seeing how different they are. A lower score is better.
 * @param layout The Tetris layout to evaluate
 * @returns
 */
const evaluateFlatness = (layout: number[][]): number => {
  let flatness = 0;

  for (let i = 0; i < layout[0].length - 1; i++) {
    const column1 = layout.map((row) => row[i]);
    const column2 = layout.map((row) => row[i + 1]);
    const diff = getHeightOfColumn(column1) - getHeightOfColumn(column2);
    flatness += diff;
  }

  return flatness;
};

const evaluateHoles = (layout: number[][]): number => {
  let holes = 0;
  for (let col = 0; col < layout[0].length; col++) {
    const column = layout.map((row) => row[col]);
    let blockFound = false;
    for (let i = column.length - 1; i >= 0; i--) {
      const cell = column[i];
      if (cell !== 0) blockFound = true;
      else if (blockFound) holes++;
    }
  }

  return holes;
};

/* Find the column with the maximum height, return that maximum height */
const evaluateHeight = (layout: number[][]): number => {
  let maxHeight = 0;
  for (let col = 0; col < layout[0].length; col++) {
    const column = layout.map((row) => row[col]);
    // Get the height of the column
    let height = 0;
    for (let i = column.length - 1; i >= 0; i--) {
      if (column[i] !== 0) {
        height = i;
        break;
      }
    }
    if (height > maxHeight) maxHeight = height;
  }

  return maxHeight;
};

/**
 * @param column Array of numbers representing a column in the board
 * @returns The height of the column
 */
const getHeightOfColumn = (column: number[]): number => {
  for (let i = column.length - 1; i >= 0; i--) {
    if (column[i] !== 0) return i;
  }
  return 0;
};
