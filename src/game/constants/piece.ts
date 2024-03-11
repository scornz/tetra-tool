import { Vector2 } from "@/game/engine";
/*
 * Information about the shape of a tetromino. Each tetromino has 4 possible
  rotations, each represented by a 2D matrix.
 */
type TetrominoShapeData = {
  [key: number]: number[][];
};

/*
 * Information about the offset of a tetromino used when rotating.
 */
type TetrominoOffsetData = {
  [key: number]: Vector2[];
};

/**
 * The 7 tetromino types (plus an 8th debuggable)
 */
export enum TetrominoType {
  I = 1,
  O = 2,
  T = 3,
  J = 4,
  L = 5,
  S = 6,
  Z = 7,
  // Debugging tetromino type
  X = 8,
}

export const TETROMINO_COLORS: {
  [id in TetrominoType]: number;
} = {
  [TetrominoType.I]: 0x6e9fbe,
  [TetrominoType.O]: 0xc1c16c,
  [TetrominoType.T]: 0xa762bc,
  [TetrominoType.J]: 0x5f63bb,
  [TetrominoType.L]: 0xb98c64,
  [TetrominoType.S]: 0x81bf6a,
  [TetrominoType.Z]: 0xcb596e,
  // Purple color used for debugging
  [TetrominoType.X]: 0x924dbf,
};

/**
 * Matrices for each tetromino type available. These will
 * be inserted into the board layout when a tetromino is placed. Position of
 * these tetrominos will be relative to bottom left corner of the matrix. Each
 * matrix has basic rotation data for each of the 4 possible rotations. The rotations
 * and matrices are based on the SRS (super rotation system) from modern Tetris games.
 */
export const TETROMINO_SHAPES: { [id in TetrominoType]: TetrominoShapeData } = {
  // I
  [TetrominoType.I]: {
    0: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ].reverse(),
    1: [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ].reverse(),
    2: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ].reverse(),
    3: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ].reverse(),
  },
  // O
  [TetrominoType.O]: {
    0: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ].reverse(),
    1: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ].reverse(),
    2: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ].reverse(),
    3: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ].reverse(),
  },
  // T
  [TetrominoType.T]: {
    0: [
      [0, 3, 0],
      [3, 3, 3],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 3, 0],
      [0, 3, 3],
      [0, 3, 0],
    ].reverse(),
    2: [
      [0, 0, 0],
      [3, 3, 3],
      [0, 3, 0],
    ].reverse(),
    3: [
      [0, 3, 0],
      [3, 3, 0],
      [0, 3, 0],
    ].reverse(),
  },
  // J
  [TetrominoType.J]: {
    0: [
      [4, 0, 0],
      [4, 4, 4],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 4, 4],
      [0, 4, 0],
      [0, 4, 0],
    ].reverse(),
    2: [
      [0, 0, 0],
      [4, 4, 4],
      [0, 0, 4],
    ].reverse(),
    3: [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ].reverse(),
  },
  // L
  [TetrominoType.L]: {
    0: [
      [0, 0, 5],
      [5, 5, 5],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 5, 0],
      [0, 5, 0],
      [0, 5, 5],
    ].reverse(),
    2: [
      [0, 0, 0],
      [5, 5, 5],
      [5, 0, 0],
    ].reverse(),
    3: [
      [5, 5, 0],
      [0, 5, 0],
      [0, 5, 0],
    ].reverse(),
  },
  // S
  [TetrominoType.S]: {
    0: [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 6, 0],
      [0, 6, 6],
      [0, 0, 6],
    ].reverse(),
    2: [
      [0, 0, 0],
      [0, 6, 6],
      [6, 6, 0],
    ].reverse(),
    3: [
      [6, 0, 0],
      [6, 6, 0],
      [0, 6, 0],
    ].reverse(),
  },
  // Z
  [TetrominoType.Z]: {
    0: [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 0, 7],
      [0, 7, 7],
      [0, 7, 0],
    ].reverse(),
    2: [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7],
    ].reverse(),
    3: [
      [0, 7, 0],
      [7, 7, 0],
      [7, 0, 0],
    ].reverse(),
  },
  // Debug
  [TetrominoType.X]: {
    0: [
      [8, 0, 8],
      [0, 0, 0],
      [8, 0, 8],
    ].reverse(),
    1: [
      [8, 0, 8],
      [0, 0, 0],
      [8, 0, 8],
    ].reverse(),
    2: [
      [8, 0, 8],
      [0, 0, 0],
      [8, 0, 8],
    ].reverse(),
    3: [
      [8, 0, 8],
      [0, 0, 0],
      [8, 0, 8],
    ].reverse(),
  },
};

/**
 * 2x4 matrix for each tetromino type available. These will be used to display
 * the next tetromino to spawn in the preview selection.
 */
export const TETROMINO_PREVIEW_SHAPES: { [id in TetrominoType]: number[][] } = {
  [TetrominoType.I]: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ].reverse(),
  [TetrominoType.O]: [
    [0, 2, 2, 0],
    [0, 2, 2, 0],
  ].reverse(),
  [TetrominoType.T]: [
    [0, 3, 0, 0],
    [3, 3, 3, 0],
  ].reverse(),
  [TetrominoType.J]: [
    [4, 0, 0, 0],
    [4, 4, 4, 0],
  ].reverse(),
  [TetrominoType.L]: [
    [0, 0, 5, 0],
    [5, 5, 5, 0],
  ].reverse(),
  [TetrominoType.S]: [
    [0, 6, 6, 0],
    [6, 6, 0, 0],
  ].reverse(),
  [TetrominoType.Z]: [
    [7, 7, 0, 0],
    [0, 7, 7, 0],
  ].reverse(),
  [TetrominoType.X]: [
    [8, 0, 0, 8],
    [0, 0, 0, 8],
  ].reverse(),
};

/**
 * When rotating a J, L, T, S, or Z tetromino, the tetromino may not be able to rotate
 * completely within the constraints of the board. These are sequential offsets
 * to attempt to move the tetromino to a valid position according to the SRS.
 */
export const JLTSZ_WALL_KICKS: { [id: number]: TetrominoOffsetData } = {
  0: {
    1: [
      new Vector2(0, 0),
      new Vector2(-1, 0),
      new Vector2(-1, 1),
      new Vector2(0, -2),
      new Vector2(-1, -2),
    ],
    3: [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(1, 1),
      new Vector2(0, -2),
      new Vector2(1, -2),
    ],
  },
  1: {
    0: [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(1, -1),
      new Vector2(0, 2),
      new Vector2(1, 2),
    ],
    2: [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(1, -1),
      new Vector2(0, 2),
      new Vector2(1, 2),
    ],
  },
  2: {
    1: [
      new Vector2(0, 0),
      new Vector2(-1, 0),
      new Vector2(-1, 1),
      new Vector2(0, -2),
      new Vector2(-1, -2),
    ],
    3: [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(1, 1),
      new Vector2(0, -2),
      new Vector2(1, -2),
    ],
  },
  3: {
    0: [
      new Vector2(0, 0),
      new Vector2(-1, 0),
      new Vector2(-1, -1),
      new Vector2(0, 2),
      new Vector2(-1, 2),
    ],
    2: [
      new Vector2(0, 0),
      new Vector2(-1, 0),
      new Vector2(-1, -1),
      new Vector2(0, 2),
      new Vector2(-1, 2),
    ],
  },
};

/**
 * When rotating an I tetromino, the tetromino may not be able to rotate completely,
 * due to the length of the tetromino. These are sequential offsets to attempt to
 * move the tetromino to a valid position according to the SRS.
 */
export const I_WALL_KICKS: { [id: number]: TetrominoOffsetData } = {
  0: {
    1: [
      new Vector2(0, 0),
      new Vector2(-2, 0),
      new Vector2(1, 0),
      new Vector2(-2, -1),
      new Vector2(1, 2),
    ],
    3: [
      new Vector2(0, 0),
      new Vector2(-1, 0),
      new Vector2(2, 0),
      new Vector2(-1, 2),
      new Vector2(2, -1),
    ],
  },
  1: {
    0: [
      new Vector2(0, 0),
      new Vector2(2, 0),
      new Vector2(-1, 0),
      new Vector2(2, 1),
      new Vector2(-1, -2),
    ],
    2: [
      new Vector2(0, 0),
      new Vector2(-1, 0),
      new Vector2(2, 0),
      new Vector2(-1, 2),
      new Vector2(2, -1),
    ],
  },
  2: {
    1: [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(-2, 0),
      new Vector2(1, -2),
      new Vector2(-2, 1),
    ],
    3: [
      new Vector2(0, 0),
      new Vector2(2, 0),
      new Vector2(-1, 0),
      new Vector2(2, 1),
      new Vector2(-1, -2),
    ],
  },
  3: {
    0: [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(-2, 0),
      new Vector2(1, -2),
      new Vector2(-2, 1),
    ],
    2: [
      new Vector2(0, 0),
      new Vector2(-2, 0),
      new Vector2(1, 0),
      new Vector2(-2, -1),
      new Vector2(1, 2),
    ],
  },
};
