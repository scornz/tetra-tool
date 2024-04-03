import React, { forwardRef } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type Props = {
  width?: number;
  height?: number;
} & BoxProps;

const Canvas = forwardRef<HTMLCanvasElement, Props>(
  ({ width = 100, height = 100, ...props }, ref) => {
    return (
      <Box width={width} height={height} {...props}>
        <canvas width={width} height={height} ref={ref} />
      </Box>
    );
  }
);

export default Canvas;
