import {
  Box,
  Button,
  HStack,
  PropsOf,
  Stack,
  layout,
  styled,
} from "@chakra-ui/react";
import { Board, Hold, NextQueue } from "@/game/objects";
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import { useEngine } from "@/state/engine";
import {
  HandleObject,
  useInstanceHandle,
  useNonnullInstanceRef,
} from "@/utils";
import {
  PredictBoardContainer,
  HoldContainer,
  NextQueueContainer,
  PredictMovesContainer,
} from ".";
import {
  BoardEntity,
  Game,
  PredictBoardEntity,
  PredictGame,
} from "@/game/entities";
import { PossibleLayout } from "@/game/alg";

const PredictGameContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<PredictGame | null>>
) => {
  const [boardRef, board] = useNonnullInstanceRef<PredictBoardEntity>();
  const [holdRef, hold] = useNonnullInstanceRef<Hold>();
  const [nextRef, next] = useNonnullInstanceRef<NextQueue>();
  const [game, setGame] = useInstanceHandle(ref);
  const [active, setActive] = useState(false);

  const [predictedLayout, setPredictedLayout] = useState<PossibleLayout | null>(
    null
  );

  const engine = useEngine();

  useEffect(() => {
    if (board && hold && next) {
      const game = new PredictGame(engine, board, hold, next);
      setGame(game);

      game.predicted.on((layout) => {
        setPredictedLayout(layout);
      });
    }
  }, [board, engine, setGame, hold, next]);

  return (
    <Stack>
      <HStack {...props} alignItems="flex-start">
        <HoldContainer ref={holdRef} />
        <PredictBoardContainer
          ref={boardRef}
          borderStyle="solid"
          borderColor="black"
          borderWidth="8px"
        />
        <NextQueueContainer ref={nextRef} />
        <PredictMovesContainer board={board} layout={predictedLayout} />
      </HStack>
      <Button
        mt={128}
        isDisabled={active}
        onClick={() => {
          game?.start();
          setActive(true);
        }}
      >
        Start Game
      </Button>
    </Stack>
  );
};

const ForwardedGameContainer = React.forwardRef(PredictGameContainer);
export default ForwardedGameContainer;
