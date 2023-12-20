import { Engine } from ".";

/**
 * Maintains the game loop and updates the engine upon receiving an animation
 * frame from the hosting window.
 */
class Renderer {
  /**
   * The current time.
   */
  time: number;
  /**
   * The time since the last frame.
   */
  deltaTime: number;

  /**
   * The last time step() was called, and the last time the game loop was updated.
   */
  private lastTime: number;
  /**
   * The current frame handle, used to cancel the animation frame.
   */
  private frameHandle: number;

  constructor(private engine: Engine) {
    this.engine = engine;
    // Set all initial times to be 0
    this.time = 0;
    this.deltaTime = 0;
    this.lastTime = 0;
    // Bind the step function to this context
    this.step = this.step.bind(this);
    // Request the initial frame
    this.frameHandle = window.requestAnimationFrame(this.step);
  }

  step(): void {
    // Grab the current time and convert from milliseconds to seconds
    this.time = performance.now() / 1000;
    // Calculate time since last frame
    this.deltaTime = this.time - this.lastTime;
    this.lastTime = this.time;
    this.engine.update(this.deltaTime);
    // Request another frame, and store the handle so we can cancel it later
    this.frameHandle = requestAnimationFrame(this.step);
  }

  destroy(): void {
    // Cancel handler on this particular animation frame
    window.cancelAnimationFrame(this.frameHandle);
  }
}
export default Renderer;
