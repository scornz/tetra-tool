import { Box, BoxProps } from "@chakra-ui/react";

type Props = BoxProps;

/**
 * A canvas element.
 */
const Canvas = ({ ...props }: Props) => {
  return <Box as="canvas" {...props} />;
};

export default Canvas;
