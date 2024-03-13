import { Box, PropsOf, styled } from "@chakra-ui/react";
import { Board } from "@/game/objects";
import React, { useRef, useEffect } from "react";
import { useEngine } from "@/state/engine";
import { HandleObject, useInstanceHandle } from "@/utils";

const BoardContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<Board | null>>
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useInstanceHandle<Board>(ref);
  const engine = useEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Access the canvas context and perform any drawing operations here
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const board = new Board(engine, ctx, 10, 30, 20, true);
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

const ForwardedBoardContainer = React.forwardRef(BoardContainer);
export default ForwardedBoardContainer;
