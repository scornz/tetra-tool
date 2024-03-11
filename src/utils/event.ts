import { Entity } from "@/game/engine";
import GameEntity from "@/game/engine/GameEntity";

interface Listener<T> {
  (args: T): void;
}

/**
 * A typed event that can be listened to, and emits events to all listeners.
 */
export class TypedEvent<T = void> {
  private listeners: Map<Listener<T>, GameEntity | undefined> = new Map();
  /** Listeners only listenining for one emit. */
  private onceListeners: Map<Listener<T>, GameEntity | undefined> = new Map();

  /** For listeners associated with an entity */
  private entities: Map<Entity, Set<Listener<T>>> = new Map();

  /**
   * Begin listening to this event. If an entity is added, this listener will
   * subscribe to the entity's onDestroy event and remove itself from the
   * event's listeners when the entity is destroyed.
   */
  on(listener: Listener<T>, entity?: GameEntity) {
    this.listeners.set(listener, entity);
    // If an entity is provided, attache this listener to that entity
    this.addToEntity(listener, entity);
  }

  /**
   * Begin listening to this event, but only once. If an entity is added, this
   * listener will subscribe to the entity's onDestroy event and remove itself
   * from the event's listeners when the entity is destroyed.
   */
  once(listener: Listener<T>, entity?: GameEntity) {
    this.onceListeners.set(listener, entity);
    // If an entity is provided, attache this listener to that entity
    this.addToEntity(listener, entity);
  }

  /**
   * Stop listening to this event. Entity is optional, and if provided, will
   * remove this listener from the entity's listeners. However, entities
   */
  off(listener: Listener<T>, entity?: GameEntity) {
    this.listeners.delete(listener);
    this.onceListeners.delete(listener);

    if (entity && this.entities.has(entity)) {
      this.entities.get(entity)!.delete(listener);
      // If the entity has no more listeners, remove it from the map
      if (this.entities.get(entity)!.size === 0) {
        this.entities.delete(entity);
      }
    }
  }

  /**
   * Add a listener to an entity's set of listeners.
   */
  private addToEntity(listener: Listener<T>, entity?: GameEntity) {
    if (!entity) return;

    // If the entity is not in the map, add it
    if (!this.entities.has(entity)) {
      this.entities.set(entity, new Set());
    }

    // Add the listener to the entity's set of listeners
    this.entities.get(entity)!.add(listener);
    // When the entity is destroyed, remove the listener
    /* Do not include an entity in this once call, as we want to keep the listener
       seperated from entity logic. */
    entity.destroyed.once(() => this.off(listener, entity));
  }

  private removeFromEntity(listener: Listener<T>, entity?: GameEntity) {
    if (!entity) return;

    if (!this.entities.has(entity)) return;

    this.entities.get(entity)!.delete(listener);
    // If the entity has no more listeners, remove it from the map
    if (this.entities.get(entity)!.size === 0) {
      this.entities.delete(entity);
    }
  }

  /**
   * Emit an event to all listeners.
   */
  emit(args: T) {
    // Call each listener
    for (const listener of this.listeners.keys()) listener(args);

    // Call all one time listeners
    for (const [listener, entity] of this.onceListeners.entries()) {
      listener(args);
      // Remove the listener after calling it
      this.onceListeners.delete(listener);
      // Remove the listener from the entity's set of listeners if it exists
      this.removeFromEntity(listener, entity);
    }
  }
}
