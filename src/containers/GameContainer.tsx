import { Box, HStack, PropsOf, styled } from "@chakra-ui/react";
import { Board, Game, Hold } from "@/game/objects";
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import { useEngine } from "@/state/engine";
import {
  HandleObject,
  useInstanceHandle,
  useNonnullInstanceRef,
} from "@/utils";
import { BoardContainer, HoldContainer } from ".";

const GameContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<Game | null>>
) => {
  const [boardRef, board] = useNonnullInstanceRef<Board>();
  const [holdRef, hold] = useNonnullInstanceRef<Hold>();
  const [game, setGame] = useInstanceHandle(ref);
  // const [game, setGame] = useState<Game>(null);
  const engine = useEngine();

  useEffect(() => {
    if (board && hold) {
      const game = new Game(engine, board, hold);
      setGame(game);
    }
  }, [board, engine, setGame]);

  return (
    <HStack {...props} alignItems="flex-start">
      <HoldContainer ref={holdRef} />
      <BoardContainer
        ref={boardRef}
        borderStyle="solid"
        borderColor="black"
        borderWidth="8px"
      />
    </HStack>
  );
};

const ForwardedGameContainer = React.forwardRef(GameContainer);
export default ForwardedGameContainer;
