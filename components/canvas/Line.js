export class LineCanvas {
  constructor(ctx, points) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i+=2)
      ctx.lineTo(points[i], points[i+1]);
    ctx.strokeStyle = '#0000ff';
    ctx.stroke();
  }
}