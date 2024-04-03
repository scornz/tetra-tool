import { Box, HStack, Icon, PropsOf, Stack, styled } from "@chakra-ui/react";
import { Board, Hold, NextQueue } from "@/game/objects";
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import { useEngine } from "@/state/engine";
import { useNonnullInstanceRefsArray } from "@/utils";
import { PredictMoveContainer } from ".";
import { PredictBoardEntity, PredictMoveEntity } from "@/game/entities";
import {
  PossibleLayout,
  PossibleLayoutMove,
  reconstructBoards,
} from "@/game/alg";
import { ArrowRight } from "@phosphor-icons/react";

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
      setMoves([
        ...reconstructBoards(board.getLayout(), layout),
        { board: layout.board, tetromino: null },
      ]);
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
    <Stack alignItems="center">
      <HStack {...props} alignItems="center">
        {moves.slice(0, moves.length - 1).map((_, i) => {
          return (
            <>
              <PredictMoveContainer
                key={i}
                ref={entityRefs[i]}
                width={50}
                height={100}
              />
              {i < moves.length - 2 && (
                <Icon
                  key={`arrow-${i}`}
                  as={ArrowRight}
                  color="gray"
                  boxSize="32px"
                />
              )}
            </>
          );
        })}
      </HStack>
      <PredictMoveContainer
        ref={entityRefs[moves.length - 1]}
        width={150}
        height={300}
        mt="16px"
      />
    </Stack>
  );
};

export default PredictMovesContainer;
