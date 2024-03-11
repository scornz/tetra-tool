import { TypedEvent } from "@/utils/event";
import { Engine, Entity } from ".";

/**
 * An entity that is attached to some object in a game. Once instatiated, it
 * is subscribed to the game loop and receives update() calls every frame.
 */
abstract class GameEntity implements Entity {
  /**
   * Event that is emitted upon destruction of this entity.
   */
  public readonly destroyed: TypedEvent<void> = new TypedEvent();

  constructor(protected engine: Engine) {
    // Add this entity to the engine
    this.engine.addEntity(this);
  }

  abstract update(delta: number): void;

  destroy(): void {
    this.destroyed.emit();
    // Remove this entity from the engine
    this.engine.removeEntity(this);
  }
}

export default GameEntity;
