import { Engine, GameEntity, InputType } from "@/game/engine";
import { BoardEntity, Game, PredictBoardEntity, TetrominoEntity } from ".";
import { Board, Hold, NextQueue, Tetromino } from "@/game/objects";
import { TetrominoType } from "../constants";
import {
  PossibleLayout,
  findBestLayout,
  getPossibleBoardsFromQueue,
} from "@/game/alg";
import { TypedEvent } from "@/utils";

class PredictGame extends Game {
  /**
   * Event that is emitted when a new layout is predicted.
   */
  public readonly predicted: TypedEvent<PossibleLayout> = new TypedEvent();

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
      getPossibleBoardsFromQueue(this.board.getLayout(), [piece, ...next])
    );

    this.board.setBestMove(layout.tetrominos[0]);

    // Emit the predicted layout
    this.predicted.emit(layout);
    return piece;
  }

  destroy(): void {
    super.destroy();
    // Clear all listeners
    this.predicted.clear();
  }
}

export default PredictGame;
