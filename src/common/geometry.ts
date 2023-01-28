export interface Point2D {
  x: number;
  y: number;
}

export const isSamePoint = (a: Point2D, b: Point2D) =>
  a.x === b.x && a.y === b.y;
