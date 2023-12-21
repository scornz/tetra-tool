import { Entity, Renderer } from ".";

class Engine implements Entity {
  /**
   * The renderer for the engine, and maintains the game loop.
   */
  renderer: Renderer;

  /**
   * A list of entities that are attached to this engine.
   */
  private entities: Set<Entity> = new Set();

  constructor() {
    // Create the game loop
    this.renderer = new Renderer(this);
  }

  update(delta: number): void {
    // Update each entity
    this.entities.forEach((e) => e.update(delta));
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
    // Remove the entity from the list of entities
    return this.entities.delete(entity);
  }

  destroy(): void {
    // Destroy all children of this engine
    this.renderer.destroy();
  }
}

export default Engine;
