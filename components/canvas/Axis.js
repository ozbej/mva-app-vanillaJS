class AxisLineCanvas {
  constructor(ctx, startPoint, endPoint) {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startPoint[0], startPoint[1]);
    ctx.lineTo(endPoint[0], endPoint[1]);
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  }
}

class AxisTextCanvas {
  constructor(ctx, text, style, position) {
    ctx.font = style; + 20
    ctx.fillText(text, position[0], position[1] + 20);
  }
}

class AxisFilterCanvas {
  constructor(ctx, type, points) {
    this.ctx = ctx;
    this.position = this.type === "upper" 
      ? { x: points[0] - 5, y: points[1] }
      : { x: points[0] - 5, y: points[1]};
    this.type = type;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (this.type === "upper") { // Draw upper filter rectangle
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(this.position.x + 10, this.position.y);
      ctx.lineTo(this.position.x + 5, this.position.y + 10);
      ctx.lineTo(this.position.x, this.position.y);
    }
    else if (this.type === "lower") { // Draw lower filter rectangle
      ctx.moveTo(this.position.x, this.position.y + 10);
      ctx.lineTo(this.position.x + 10, this.position.y + 10);
      ctx.lineTo(this.position.x + 5, this.position.y);
      ctx.lineTo(this.position.x, this.position.y + 10);
    }
    else console.error("Error: Invalid AxisFilter.type value");
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  }
  
  setPosition(x, y) {
    // Update the position of the filter rectangle
    this.position.x = x - 5;
    this.position.y = y;
    
    // Clear the canvas and redraw the filter rectangle at its new position
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.draw();
  }
}

export { AxisLineCanvas, AxisTextCanvas, AxisFilterCanvas };