import * as PIXI from 'pixi.js';

class AxisLine extends PIXI.Graphics {
  constructor(startPoint, endPoint) {
    super();
    this.lineStyle(3, 0x000000, 1);
    this.moveTo(startPoint[0], startPoint[1]);
    this.lineTo(endPoint[0], endPoint[1]);
  }
}

class AxisText extends PIXI.Text {
  constructor(text, style, position) {
    super(text, style);
    this.position.set(position[0], position[1]);
  }
}

class AxisFilter extends PIXI.Graphics {
  constructor(app, type, points) {
    super();
    this.app = app;
    this.beginFill(0x000000);
    this.lineStyle(2, 0x000000, 1);
    if (type === "upper") { // Draw upper filter rectangle
      this.moveTo(points[0]-5, points[1]-10);
      this.lineTo(points[0]+5, points[1]-10);
      this.lineTo(points[0], points[1]);
      this.lineTo(points[0]-5, points[1]-10);
    }
    else if (type === "lower") { // Draw lower filter rectangle
      this.moveTo(points[0]-5, points[1]+10);
      this.lineTo(points[0]+5, points[1]+10);
      this.lineTo(points[0], points[1]);
      this.lineTo(points[0]-5, points[1]+10);
    }
    else console.error("Error: Invalid AxisFilter.type value");
    this.endFill();

    // Make object interactive
    this.interactive = true;
    this.cursor = 'pointer';

    // Add event listeners for dragging behavior
    this.on('pointerdown', this.onDragStart);
    this.on('pointerup', this.onDragEnd);
    this.on('pointerupoutside', this.onDragEnd);
    this.on('pointermove', this.onDragMove);
  }

  onDragStart(e) {
    this.data = e.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
  }

  onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }
}

export { AxisLine, AxisText, AxisFilter };