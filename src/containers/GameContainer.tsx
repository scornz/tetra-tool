import { Box, PropsOf, styled } from "@chakra-ui/react";
import { Board, Game } from "@/game/objects";
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import { useEngine } from "@/state/engine";
import {
  HandleObject,
  useInstanceHandle,
  useNonnullInstanceRef,
} from "@/utils";
import { BoardContainer } from ".";

const GameContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<Game | null>>
) => {
  const [boardRef, board] = useNonnullInstanceRef<Board>();
  const [game, setGame] = useInstanceHandle(ref);
  // const [game, setGame] = useState<Game>(null);
  const engine = useEngine();

  useEffect(() => {
    if (board) {
      const game = new Game(engine, board);
      setGame(game);
    }
  }, [board, engine, setGame]);

  return (
    <Box {...props}>
      <BoardContainer
        ref={boardRef}
        borderStyle="solid"
        borderColor="black"
        borderWidth="8px"
      />
    </Box>
  );
};

const ForwardedGameContainer = React.forwardRef(GameContainer);
export default ForwardedGameContainer;
