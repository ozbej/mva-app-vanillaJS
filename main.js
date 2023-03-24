import * as PIXI from 'pixi.js';
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth';

const width = window.innerWidth;
const height = 600;
const xOffset = 50;
const yOffset = 50;
const antialiasing = true;

let numAxis;
let axisSpacing;
let axisScales;

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

function calculateLine(points) {
  let lineNew = [];
  for (let i = 0; i < numAxis; i++) {
    lineNew.push(xOffset + i * axisSpacing, yOffset + height * (1 - getPercentage(points[i], axisScales[i].min, axisScales[i].max)));
  }
  return lineNew;
}

function drawAxis(app, rows) {
  numAxis = rows[0].length;
  axisSpacing = width / (numAxis + 1);
  axisScales = getMinMaxByColumn(rows);

  let graphics;
  for (let i = 0; i < numAxis; i++) {
    graphics = antialiasing ? new Graphics() : new PIXI.Graphics;
    graphics.lineStyle(1, 0x000000, 1);
    graphics.moveTo(xOffset + i * axisSpacing, yOffset);
    graphics.lineTo(xOffset + i * axisSpacing, yOffset + height);
    app.stage.addChild(graphics);

    const text = new PIXI.Text(`Dim-${i}`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "black"
    });
    text.position.set(i * axisSpacing, height + yOffset + 20);
    app.stage.addChild(text);
  }
}

function drawLines(app, rows) {
  let graphics;
  let points;
  for (let i = 0; i < rows.length; i++) {
    points = calculateLine(rows[i]);

    graphics = antialiasing ? new Graphics() : new PIXI.Graphics;
    graphics.lineStyle(2, 0x0000ff, 1);
    graphics.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i+=2)
      graphics.lineTo(points[i], points[i+1]);
    app.stage.addChild(graphics);
  }
}

function main() {
  let app = new PIXI.Application({ 
    width: width, height: height+yOffset+50, backgroundColor: 0xffffff });
  document.body.appendChild(app.view);

  const rows = generateRandomData(100, 20);

  drawAxis(app, rows);
  drawLines(app, rows);
}

main();
