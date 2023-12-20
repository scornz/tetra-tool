import { Entity, Renderer } from ".";

class Engine implements Entity {
  /**
   * The renderer for the engine, and maintains the game loop.
   */
  renderer: Renderer;

  constructor() {
    // Create the game loop
    this.renderer = new Renderer(this);
  }

  update(delta: number): void {}

  destroy(): void {
    // Destroy all children of this engine
    this.renderer.destroy();
  }
}

export default Engine;
