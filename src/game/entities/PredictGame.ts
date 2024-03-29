import { Engine, GameEntity, InputType } from "@/game/engine";
import { BoardEntity, Game, PredictBoardEntity, TetrominoEntity } from ".";
import { Board, Hold, NextQueue, Tetromino } from "@/game/objects";
import { TetrominoType } from "../constants";
import { findBestLayout, getPossibleBoardsFromQueue } from "@/game/alg";

class PredictGame extends Game {
  constructor(
    engine: Engine,
    protected readonly board: PredictBoardEntity,
    hold: Hold,
    next: NextQueue
  ) {
    super(engine, board, hold, next);
  }

  /**
   * Spawns the next piece in the sequence into the game
   */
  spawnNext(): TetrominoType {
    const piece = super.spawnNext();

    const next = this.next.getQueue();

    // Find the best move for the next piece
    const layout = findBestLayout(
      getPossibleBoardsFromQueue(this.board.getLayout(), [
        piece,
        next[0],
        next[1],
      ])
    );
    this.board.setBestMove(layout.tetrominos[0]);

    return piece;
  }
}

export default PredictGame;
