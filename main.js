import * as PIXI from 'pixi.js';

import { Line } from './components/Line';
import { AxisFilter, AxisLine, AxisText } from './components/Axis';

/* --- Constants --- */
const width = window.innerWidth;
const height = 600;
const xOffset = 50;
const yOffset = 50;

function generateRandomData(numberRows, numberCols) {
  let rows = [];
  for (let i = 0; i < numberRows; i++)
    rows.push(Array.from({length: numberCols}, () => Math.floor(Math.random() * 100)));
  return rows;
}

function getMinMaxByColumn(arr) {
  const numCols = arr[0].length;
  const result = [];
  
  for (let col = 0; col < numCols; col++) {
    const column = arr.map(row => row[col]);
    const filtered = column.filter(val => !Number.isNaN(val));
    result.push({
      min: Math.min(...filtered),
      max: Math.max(...filtered)
    });
  }
  return result;
}

function getPercentage(value, min, max) {
  return (value - min) / (max - min);
}

function calculateLine(points, numAxis, axisSpacing, axisScales) {
  let lineNew = [];
  for (let i = 0; i < numAxis; i++) {
    lineNew.push(xOffset + i * axisSpacing, yOffset + height * (1 - getPercentage(points[i], axisScales[i].min, axisScales[i].max)));
  }
  return lineNew;
}

function onDragMove(event) {
  if (dragTarget) {
      dragTarget.parent.toLocal(event.global, null, dragTarget.position);
      dragTarget.position.x = dragTarget.positionX;
  }
}

function onDragStart() {
  this.alpha = 0.5;
  dragTarget = this;
  app.stage.on('pointermove', onDragMove);
}

function onDragEnd() {
  if (dragTarget) {
      app.stage.off('pointermove', onDragMove);
      dragTarget.alpha = 1;
      dragTarget = null;
  }
}

function main() {
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEnd);
  app.stage.on('pointerupoutside', onDragEnd);

  // Generate random data
  const rows = generateRandomData(100, 3);

  let numAxis = rows[0].length;
  let axisSpacing = width / (numAxis + 1);
  let axisScales = getMinMaxByColumn(rows);

  // Draw axes
  let axisLine, axisText, axisFilterUpper, axisFilterLower;
  for (let i = 0; i < numAxis; i++) {
    axisLine = new AxisLine([xOffset + i * axisSpacing, yOffset], [xOffset + i * axisSpacing, yOffset + height])
    axisText = new AxisText(`Dim-${i}`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "black"
    },
    [i * axisSpacing, height + yOffset + 20]);
    axisFilterUpper = new AxisFilter(app, "upper", [xOffset + i * axisSpacing, yOffset], onDragStart);
    axisFilterLower = new AxisFilter(app, "lower", [xOffset + i * axisSpacing, yOffset + height], onDragStart);
    app.stage.addChild(axisLine, axisText, axisFilterUpper, axisFilterLower);
  }

  // Draw lines
  let line;
  for (let i = 0; i < rows.length; i++) {
    line = new Line(calculateLine(rows[i], numAxis, axisSpacing, axisScales));
    app.stage.addChild(line);
  }
}

let app = new PIXI.Application({ 
  width: width, height: height+yOffset+50, backgroundColor: 0xffffff });
document.body.appendChild(app.view);

let dragTarget = null;

main();
