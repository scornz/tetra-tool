import { Box, HStack, PropsOf, styled } from "@chakra-ui/react";
import { Board, Hold, NextQueue } from "@/game/objects";
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import { useEngine } from "@/state/engine";
import {
  HandleObject,
  useInstanceHandle,
  useNonnullInstanceRef,
  useNonnullInstanceRefsArray,
} from "@/utils";
import {
  PredictBoardContainer,
  HoldContainer,
  NextQueueContainer,
  PredictMoveContainer,
} from ".";
import {
  BoardEntity,
  Game,
  PredictBoardEntity,
  PredictGame,
  PredictMoveEntity,
} from "@/game/entities";
import {
  PossibleLayout,
  PossibleLayoutMove,
  reconstructBoards,
} from "@/game/alg";

type Props = {
  board: PredictBoardEntity | null;
  layout: PossibleLayout | null;
} & PropsOf<typeof Box>;

const PredictMovesContainer = ({ board, layout, ...props }: Props) => {
  const [moves, setMoves] = useState<PossibleLayoutMove[]>([]);
  const [entityRefs, getEntity] =
    useNonnullInstanceRefsArray<PredictMoveEntity>(moves.length);

  useEffect(() => {
    if (layout && board) {
      // Reconstruct the boards from the layout
      setMoves(reconstructBoards(board.getLayout(), layout));
    }
  }, [layout, board]);

  useEffect(() => {
    // Set the move for each entity
    moves.forEach((move, i) => {
      const entity = getEntity(i);
      if (entity) {
        entity.setMove(move);
      }
    });
  }, [moves, getEntity]);

  return (
    <HStack {...props} alignItems="flex-start">
      {moves.map((move, i) => {
        return <PredictMoveContainer key={i} ref={entityRefs[i]} />;
      })}
    </HStack>
  );
};

export default PredictMovesContainer;
