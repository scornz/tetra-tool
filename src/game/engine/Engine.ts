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

  update(delta: number): void {
    // Print the current time for debugging purposes
    console.log(this.renderer.time);
  }

  destroy(): void {
    // Destroy all children of this engine
    this.renderer.destroy();
  }
}

export default Engine;
