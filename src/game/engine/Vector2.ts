/**
 * A 2D vector. Supports basic vector operations.
 */
class Vector2 {
  constructor(
    public readonly x: number = 0.0,
    public readonly y: number = 0.0
  ) {}

  /**
   * Add another vector to this vector.
   * @param other The vector to add
   * @returns The resulting vector
   */
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }
}
export default Vector2;
