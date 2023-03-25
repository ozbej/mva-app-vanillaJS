import * as PIXI from 'pixi.js';
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth';

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

function main() {
  let app = new PIXI.Application({ 
    width: width, height: height+yOffset+50, backgroundColor: 0xffffff });
  document.body.appendChild(app.view);

  app.stage.interactive = true;

  // Generate random data
  const rows = generateRandomData(100, 10);

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
    axisFilterUpper = new AxisFilter(app, "upper", [xOffset + i * axisSpacing, yOffset]);
    axisFilterLower = new AxisFilter(app, "lower", [xOffset + i * axisSpacing, yOffset + height]);
    app.stage.addChild(axisLine, axisText, axisFilterUpper, axisFilterLower);
  }

  // Draw lines
  let line;
  for (let i = 0; i < rows.length; i++) {
    line = new Line(calculateLine(rows[i], numAxis, axisSpacing, axisScales));
    app.stage.addChild(line);
  }
}

main();
