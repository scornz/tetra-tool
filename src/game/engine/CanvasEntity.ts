import { Engine } from ".";
import GameEntity from "./GameEntity";

/**
 * An entity that is attached to canvas context. It handles all drawing and mandates
 * a canvas context to be passed in.
 */
abstract class CanvasEntity extends GameEntity {
  /**
   * The canvas attached to this entity.
   */
  protected ctx: CanvasRenderingContext2D;

  constructor(engine: Engine, ctx: CanvasRenderingContext2D) {
    super(engine);
    this.ctx = ctx;
  }

  abstract update(delta: number): void;

  /**
   * Draw onto the canvas.
   */
  abstract draw(): void;

  destroy(): void {
    // Ensure that the canvas is clear
    this.clear();
  }

  /**
   * Clear the entire canvas.
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

export default CanvasEntity;
