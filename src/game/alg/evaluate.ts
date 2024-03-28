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
  const flatness = evaluateFlatness(layout);

  return flatness;
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

    const diff = Math.abs(
      column1.reduce((a, b) => a + b, 0) - column2.reduce((a, b) => a + b, 0)
    );
    flatness += diff;
  }

  return flatness;
};
