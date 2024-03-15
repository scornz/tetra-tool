import { Entity, Input, Renderer } from ".";

class Engine implements Entity {
  /**
   * The renderer for the engine, and maintains the game loop.
   */
  renderer: Renderer;

  /**
   * The input manager for the engine.
   */
  input: Input;

  /**
   * A list of entities that are attached to this engine.
   */
  private entities: Set<Entity> = new Set();

  constructor() {
    // Create the game loop
    this.renderer = new Renderer(this);
    this.input = new Input(this);
  }

  update(delta: number): void {
    // Update each entity
    this.entities.forEach((e) => e.update(delta));
    // Update the input manager
    this.input.update(delta);
  }

  /**
   * Add an entity to the engine.
   */
  addEntity(entity: Entity): void {
    // Add the entity to the list of entities
    this.entities.add(entity);
  }

  /**
   * Remove an entity from the engine.
   */
  removeEntity(entity: Entity): boolean {
    console.log("Removing entity ", entity);
    // Remove the entity from the list of entities
    return this.entities.delete(entity);
  }

  destroy(): void {
    // Destroy all children of this engine
    this.renderer.destroy();
  }
}

export default Engine;
