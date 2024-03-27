import { Box, HStack, PropsOf, styled } from "@chakra-ui/react";
import { Board, Game, Hold, NextQueue } from "@/game/objects";
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import { useEngine } from "@/state/engine";
import {
  HandleObject,
  useInstanceHandle,
  useNonnullInstanceRef,
} from "@/utils";
import { BoardContainer, HoldContainer, NextQueueContainer } from ".";
import { BoardEntity } from "@/game/entities";

const GameContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<Game | null>>
) => {
  const [boardRef, board] = useNonnullInstanceRef<BoardEntity>();
  const [holdRef, hold] = useNonnullInstanceRef<Hold>();
  const [nextRef, next] = useNonnullInstanceRef<NextQueue>();
  const [game, setGame] = useInstanceHandle(ref);
  // const [game, setGame] = useState<Game>(null);
  const engine = useEngine();

  useEffect(() => {
    if (board && hold && next) {
      const game = new Game(engine, board, hold, next);
      setGame(game);
    }
  }, [board, engine, setGame, hold, next]);

  return (
    <HStack {...props} alignItems="flex-start">
      <HoldContainer ref={holdRef} />
      <BoardContainer
        ref={boardRef}
        borderStyle="solid"
        borderColor="black"
        borderWidth="8px"
      />
      <NextQueueContainer ref={nextRef} />
    </HStack>
  );
};

const ForwardedGameContainer = React.forwardRef(GameContainer);
export default ForwardedGameContainer;
