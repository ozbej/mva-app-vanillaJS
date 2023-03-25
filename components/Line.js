import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth';

export class Line extends Graphics {
  constructor(points) {
    super();
    this.lineStyle(1, 0x0000ff, 1);
    this.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i+=2)
      this.lineTo(points[i], points[i+1]);
  }
}