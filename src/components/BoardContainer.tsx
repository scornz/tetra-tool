import { Box, PropsOf, styled } from "@chakra-ui/react";
import { Board } from "@/game/objects";
import React, { useRef, useEffect } from "react";

const BoardContainer = ({ ...props }: PropsOf<typeof Box>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const board = null;
    if (canvas) {
      // Access the canvas context and perform any drawing operations here
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const board = new Board(ctx, 10, 30, 20, true);
        // Example: Draw a red rectangle
        board.draw();
      }
    }

    return () => {};
  }, []);

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

export default BoardContainer;
