import { Box, PropsOf } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { useEngine } from "@/state/engine";
import { HandleObject, useInstanceHandle } from "@/utils";
import { PredictMoveEntity } from "@/game/entities";
import { Canvas } from "@/components";

type Props = PropsOf<typeof Canvas> & PropsOf<typeof Box>;

const PredictMoveContainer = (
  { height = 100, width = 50, ...props }: Props,
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
    <Canvas
      ref={canvasRef}
      style={{ display: "block" }}
      width={width}
      height={height}
      border="3px solid"
      {...props}
    />
  );
};

const ForwardedPredictMoveContainer = React.forwardRef(PredictMoveContainer);
export default ForwardedPredictMoveContainer;
