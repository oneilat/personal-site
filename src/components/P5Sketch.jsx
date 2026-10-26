import React from 'react';
import Sketch from 'react-p5';
import { shoreDistance } from '../data/field-tide.js';
import { getOpening } from '../data/field-opening.js';

const brightGruvbox = {
  bg: '#1d2021',
  blue: '#89b482',
  aqua: '#9ec07f',
  green: '#c0ca33',
  yellow: '#ffdd55',
  orange: '#ffa044',
  red: '#ff6655',
  purple: '#e199b8',
  fg: '#f2e5c7',
  gray2: '#665c54',
  gray3: '#928374'
};

const scl = 5;
const LOOP_DURATION = 1800;
let cols, rows, terrain = [], shore = [];

export default function P5Sketch() {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.frameRate(30);
    p5.colorMode(p5.RGB, 255);
    initGrid(p5);
  };

  const draw = (p5) => {
    p5.background(brightGruvbox.bg);
    const theta = p5.TWO_PI * (p5.frameCount % LOOP_DURATION) / LOOP_DURATION;
    generateTerrain(p5, theta);
    generateShore(p5, theta);
    drawContours(p5);
    drawShoreline(p5);
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    initGrid(p5);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

function initGrid(p5) {
  cols = Math.floor(p5.width / scl);
  rows = Math.floor(p5.height / scl);
  terrain = Array.from({ length: cols }, () => Array(rows).fill(0));
}

function generateTerrain(p5, theta) {
  const R = 15;
  let loopAngle = theta * 0.025;
  let waveT = theta * 0.05;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let xoff = x * 0.05;
      let yoff = y * 0.05;
      let loopX = R * Math.cos(loopAngle);
      let loopY = R * Math.sin(loopAngle);

      let elevation =
        p5.noise(xoff * 0.3 + loopX, yoff * 0.3 + loopY) * 60 +
        p5.noise(xoff * 0.1 + loopX * 1.5, yoff * 0.1 + loopY * 1.5) * 30 +
        p5.noise(xoff * 0.03 + loopX * 2.5, yoff * 0.03 + loopY * 2.5) * 15 +
        Math.sin(xoff + waveT) * 10 +
        Math.cos(yoff + waveT) * 8;

      terrain[x][y] = elevation - 60;
    }
  }
}

// Contour dots all sit at their own level, so the shore needs a separate wave or every color cuts straight.
function generateShore(p5, theta) {
  const R = 15;
  const loopAngle = theta * 0.025;
  const loopX = R * Math.cos(loopAngle);
  const loopY = R * Math.sin(loopAngle);
  shore = Array.from({ length: rows }, (_, y) => [-1, 1].map((side) => {
    const n = p5.noise(y * 0.02 + loopX, side * 40 + loopY);
    return (n - 0.36) / 0.42;
  }));
}

function drawContours(p5) {
  const contourLevels = [
    { level: -50, color: brightGruvbox.blue },
    { level: -35, color: brightGruvbox.gray3 },
    { level: -25, color: brightGruvbox.aqua },
    { level: -15, color: brightGruvbox.green },
    { level: -5, color: brightGruvbox.yellow },
    { level: 5, color: brightGruvbox.orange },
    { level: 15, color: brightGruvbox.red },
    { level: 25, color: brightGruvbox.purple },
    { level: 35, color: brightGruvbox.fg },
    { level: 45, color: brightGruvbox.gray2 }
  ];

  p5.noStroke();

  for (let { level, color } of contourLevels) {
    const col = p5.color(color);
    col.setAlpha(220);
    p5.fill(col);

    console.log('Drawing contour at level:', level, 'with color:', color);
    drawDotsAtContour(p5, level, 1.3);
  }
}

function drawShoreline(p5) {
  const opening = getOpening();
  if (opening < 0.02) return;
  const col = p5.color(brightGruvbox.gray3);
  col.setAlpha(220);
  p5.noStroke();
  p5.fill(col);
  const center = p5.width / 2;
  for (let y = 1; y < rows - 1; y++) {
    const y0 = y * scl;
    const next = Math.min(y + 1, rows - 1);
    const left0 = center - shoreDistance(p5.width, opening, shore[y][0]);
    const left1 = center - shoreDistance(p5.width, opening, shore[next][0]);
    const right0 = center + shoreDistance(p5.width, opening, shore[y][1]);
    const right1 = center + shoreDistance(p5.width, opening, shore[next][1]);
    for (let py = y0; py < y0 + scl; py += 2) {
      const t = (py - y0) / scl;
      p5.ellipse(left0 + (left1 - left0) * t, py, 1.2, 1.2);
      p5.ellipse(right0 + (right1 - right0) * t, py, 1.2, 1.2);
    }
  }
}

function drawDotsAtContour(p5, target, threshold) {
  const opening = getOpening();
  for (let x = 1; x < cols - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let val = terrain[x][y];
      if (Math.abs(val - target) < threshold) {
        let px = x * scl;
        let py = y * scl;
        const side = px < p5.width / 2 ? 0 : 1;
        if (Math.abs(px - p5.width / 2) < shoreDistance(p5.width, opening, shore[y][side])) continue;
        p5.ellipse(px, py, 1.2, 1.2);
      }
    }
  }
}
