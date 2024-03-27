import { Box, PropsOf, styled } from "@chakra-ui/react";
import { Board, Hold } from "@/game/objects";
import React, { useRef, useEffect } from "react";
import { useEngine } from "@/state/engine";
import { HandleObject, useInstanceHandle } from "@/utils";

const HoldContainer = (
  { ...props }: PropsOf<typeof Box>,
  ref: React.ForwardedRef<HandleObject<Hold | null>>
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hold, setHold] = useInstanceHandle<Hold>(ref);
  const engine = useEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Access the canvas context and perform any drawing operations here
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const hold = new Hold(engine, ctx);
        setHold(hold);
      }
    }

    return () => {};
  }, [engine, setHold]);

  return (
    <Box {...props}>
      <canvas
        ref={canvasRef}
        style={{ display: "block" }}
        width={80}
        height={40}
      />
    </Box>
  );
};

const ForwardedHoldContainer = React.forwardRef(HoldContainer);
export default ForwardedHoldContainer;
