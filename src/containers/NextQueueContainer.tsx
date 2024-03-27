import { Box, PropsOf } from "@chakra-ui/react";
import { NextQueue } from "@/game/objects";
import React, { useRef, useEffect } from "react";
import { useEngine } from "@/state/engine";
import { HandleObject, useInstanceHandle } from "@/utils";

const NextQueueContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<NextQueue | null>>
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [next, setNext] = useInstanceHandle<NextQueue>(ref);
  const engine = useEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Access the canvas context and perform any drawing operations here
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const next = new NextQueue(engine, ctx, 5);
        setNext(next);
      }
    }
  }, [engine, setNext]);

  return (
    <Box {...props}>
      <canvas
        ref={canvasRef}
        style={{ display: "block" }}
        width={80}
        height={350}
      />
    </Box>
  );
};

const ForwardedNextQueueContainer = React.forwardRef(NextQueueContainer);
export default ForwardedNextQueueContainer;
