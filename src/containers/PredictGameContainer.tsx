import { Box, HStack, PropsOf, styled } from "@chakra-ui/react";
import { Board, Hold, NextQueue } from "@/game/objects";
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import { useEngine } from "@/state/engine";
import {
  HandleObject,
  useInstanceHandle,
  useNonnullInstanceRef,
} from "@/utils";
import { PredictBoardContainer, HoldContainer, NextQueueContainer } from ".";
import {
  BoardEntity,
  Game,
  PredictBoardEntity,
  PredictGame,
} from "@/game/entities";

const PredictGameContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<PredictGame | null>>
) => {
  const [boardRef, board] = useNonnullInstanceRef<PredictBoardEntity>();
  const [holdRef, hold] = useNonnullInstanceRef<Hold>();
  const [nextRef, next] = useNonnullInstanceRef<NextQueue>();
  const [game, setGame] = useInstanceHandle(ref);
  const engine = useEngine();

  useEffect(() => {
    if (board && hold && next) {
      const game = new PredictGame(engine, board, hold, next);
      setGame(game);
    }
  }, [board, engine, setGame, hold, next]);

  return (
    <HStack {...props} alignItems="flex-start">
      <HoldContainer ref={holdRef} />
      <PredictBoardContainer
        ref={boardRef}
        borderStyle="solid"
        borderColor="black"
        borderWidth="8px"
      />
      <NextQueueContainer ref={nextRef} />
    </HStack>
  );
};

const ForwardedGameContainer = React.forwardRef(PredictGameContainer);
export default ForwardedGameContainer;
