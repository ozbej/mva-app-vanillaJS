import * as PIXI from 'pixi.js';

class AxisLinePixi extends PIXI.Graphics {
  constructor(startPoint, endPoint) {
    super();
    this.lineStyle(3, 0x000000, 1);
    this.moveTo(startPoint[0], startPoint[1]);
    this.lineTo(endPoint[0], endPoint[1]);
  }
}

class AxisTextPixi extends PIXI.Text {
  constructor(text, style, position) {
    super(text, style);
    this.position.set(position[0], position[1]);
  }
}

class AxisFilterPixi extends PIXI.Graphics {
  constructor(app, type, points, onDragStart) {
    super();
    this.positionX = points[0]-5;
    this.app = app;
    this.beginFill(0x000000);
    this.lineStyle(2, 0x000000, 1);
    if (type === "upper") { // Draw upper filter rectangle
      this.moveTo(0, 0);
      this.lineTo(10, 0);
      this.lineTo(5, 10);
      this.lineTo(0, 0);
      this.position.set(points[0]-5, points[1]-10);
    }
    else if (type === "lower") { // Draw lower filter rectangle
      this.moveTo(0, 10);
      this.lineTo(10, 10);
      this.lineTo(5, 0);
      this.lineTo(0, 10);
      this.position.set(points[0]-5, points[1]);
    }
    else console.error("Error: Invalid AxisFilter.type value");
    this.endFill();

    // Make object interactive
    this.interactive = true;
    this.cursor = 'pointer';

    this.on('pointerdown', onDragStart, this);
  }
}

export { AxisLinePixi, AxisTextPixi, AxisFilterPixi };