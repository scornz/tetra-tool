import { Box, PropsOf } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { useEngine } from "@/state/engine";
import { HandleObject, useInstanceHandle } from "@/utils";
import { BoardEntity, PredictBoardEntity } from "@/game/entities";

const PredictBoardContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<PredictBoardEntity | null>>
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useInstanceHandle<PredictBoardEntity>(ref);
  const engine = useEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Access the canvas context and perform any drawing operations here
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const board = new PredictBoardEntity(engine, ctx, 10, 30, 20, true);
        setBoard(board);
        // Example: Draw a red rectangle
        board.draw();
      }
    }

    return () => {};
  }, [engine, setBoard]);

  return (
    <Box {...props}>
      <canvas
        ref={canvasRef}
        style={{ display: "block" }}
        width={200}
        height={400}
      />
    </Box>
  );
};

const ForwardedBoardContainer = React.forwardRef(PredictBoardContainer);
export default ForwardedBoardContainer;
