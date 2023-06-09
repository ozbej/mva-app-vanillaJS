import * as PIXI from 'pixi.js';
import Konva from 'konva';

console.log("Is WebGL supported: ", PIXI.utils.isWebGLSupported());

// PixiJS
import { LinePixi } from './components/pixijs/Line';
import { AxisFilterPixi, AxisLinePixi, AxisTextPixi } from './components/pixijs/Axis';

// Canvas
import { LineCanvas } from './components/canvas/Line';
import { AxisFilterCanvas, AxisLineCanvas, AxisTextCanvas } from './components/canvas/Axis';

/* --- Constants --- */
const width = window.innerWidth;
const height = 500;
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

  /* ----------- PixiJS ----------- */
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEnd);
  app.stage.on('pointerupoutside', onDragEnd);

  /* ----------- Vanilla Canvas ----------- */
  // const canvasElement = document.createElement('canvas');
  // canvasElement.setAttribute('id', 'parCoordCanvas');
  // canvasElement.setAttribute('width', width);
  // canvasElement.setAttribute('height', height+yOffset+50);
  // document.body.appendChild(canvasElement);

  // const canvas = document.getElementById("parCoordCanvas");
  // if (!canvas.getContext) return;
  // const ctx = canvas.getContext("2d");

  /* ----------- Drawing ----------- */

  // Generate random data
  const rows = generateRandomData(100, 10);

  let numAxis = rows[0].length;
  let axisSpacing = width / (numAxis + 1);
  let axisScales = getMinMaxByColumn(rows);

  // Draw lines
  let line;
  for (let i = 0; i < rows.length; i++) {
    line = new LinePixi(calculateLine(rows[i], numAxis, axisSpacing, axisScales));
    app.stage.addChild(line);

    //line = new LineCanvas(ctx, calculateLine(rows[i], numAxis, axisSpacing, axisScales));
  }

  // Draw axes
  let axisLine, axisText, axisFilterUpper, axisFilterLower, konvaText;
  for (let i = 0; i < numAxis; i++) {
    axisLine = new AxisLinePixi([xOffset + i * axisSpacing, yOffset], [xOffset + i * axisSpacing, yOffset + height])
    axisText = new AxisTextPixi(`Dim-${i}*`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "black"
    },
    [i * axisSpacing, height + yOffset + 20]);

    // Konva text
    konvaText = new Konva.Text({
      x: i * axisSpacing,
      y: height + yOffset + 50,
      text: `Dim-${i}**`,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: 'black',
    });
    layer.add(konvaText);

    axisFilterUpper = new AxisFilterPixi(app, "upper", [xOffset + i * axisSpacing, yOffset], onDragStart);
    axisFilterLower = new AxisFilterPixi(app, "lower", [xOffset + i * axisSpacing, yOffset + height], onDragStart);
    app.stage.addChild(axisLine, axisText, axisFilterUpper, axisFilterLower);
    //app.stage.addChild(axisLine, axisFilterUpper, axisFilterLower);

    // axisLine = new AxisLineCanvas(ctx, [xOffset + i * axisSpacing, yOffset], [xOffset + i * axisSpacing, yOffset + height])
    // axisText = new AxisTextCanvas(ctx, `Dim-${i}`, "24px arial", [i * axisSpacing, height + yOffset + 20]);
    // axisFilterUpper = new AxisFilterCanvas(ctx, "upper", [xOffset + i * axisSpacing, yOffset-10]);
    // axisFilterLower = new AxisFilterCanvas(ctx, "lower", [xOffset + i * axisSpacing, yOffset + height]);
  }
}

const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
// Set canvas dimensions
canvas1.width = canvas2.width = width;
canvas1.height = canvas2.height = height+yOffset+100;

// Create Pixi application
let app = new PIXI.Application({ 
  view: canvas1, width: width, height: height+yOffset+100, backgroundColor: 0xffffff });
document.body.appendChild(app.view);
let dragTarget = null;

// Create a Konva stage from the canvas
const stage = new Konva.Stage({
  container: canvas2,
  width: width,
  height: height+yOffset+100,
});
// Create a Konva.Layer object
const layer = new Konva.Layer();

main();

const legend = new Konva.Text({
  x: 50,
  y: height + yOffset + 80,
  text: '*: Text rendered with Pixi.js; **: Text rendered with Kanva.js',
  fontSize: 12,
  fontFamily: 'Arial',
  fill: 'black',
});
layer.add(legend);

// Add the layer to the stage
stage.add(layer);

// Draw the stage
stage.draw();
