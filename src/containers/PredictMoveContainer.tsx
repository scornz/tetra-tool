import { Box, PropsOf } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { useEngine } from "@/state/engine";
import { HandleObject, useInstanceHandle } from "@/utils";
import { PredictMoveEntity } from "@/game/entities";

const PredictMoveContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<PredictMoveEntity | null>>
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [move, setMove] = useInstanceHandle<PredictMoveEntity>(ref);
  const engine = useEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Access the canvas context and perform any drawing operations here
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const move = new PredictMoveEntity(engine, ctx);
        setMove(move);
      }
    }

    return () => {};
  }, [engine, setMove]);

  return (
    <Box {...props}>
      <canvas
        ref={canvasRef}
        style={{ display: "block" }}
        width={50}
        height={100}
      />
    </Box>
  );
};

const ForwardedPredictMoveContainer = React.forwardRef(PredictMoveContainer);
export default ForwardedPredictMoveContainer;
