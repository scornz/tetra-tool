/**
 * Converts the given coordinates to the canvas coordinate system, inverting
 * the y-coordinate
 */
export const getCoords = (canvas: HTMLCanvasElement, x: number, y: number) => ({
  x,
  y: -y + canvas.height,
});
