/**
 * A set of board layouts.
 */
export class LayoutSet {
  private set: Set<string> = new Set<string>();
  private layouts: number[][][] = [];

  public add(layout: number[][]): void {
    // Get the hash for this layout
    const hash = hashLayout(layout);
    if (this.set.has(hash)) return;

    this.set.add(hash);
    this.layouts.push(layout);
  }

  public size(): number {
    return this.set.size;
  }

  public values(): number[][][] {
    return this.layouts;
  }
}

/**
 * Hash a layout to a unique string.
 * @param layout The layout to hash
 * @returns A unique hash for the layout, based on the filled positions
 */
const hashLayout = (layout: number[][]): string => {
  let hash = "";
  // Iterate through the matrix to build a binary string
  layout.forEach((row) => {
    let rowBinaryString = "";
    row.forEach((cell) => {
      // Add '1' for filled positions and '0' for unfilled
      rowBinaryString += cell !== 0 ? "1" : "0";
    });
    // Convert the binary row string to hexadecimal and concatenate
    hash += parseInt(rowBinaryString, 2).toString(16);
  });
  return hash;
};
