let inputText, fontSize, colorText, colorBG;
let textX, textY;
let weight, tracking, blurSlider, scaleYInput, fontSelect, spreadSlider;

let scaleYValue = 1;
let selectedFont = "Roboto Flex";
let brushActive = false;

let letters = [];

function setup() {
  let preview = select("#previewContainer");
  let canvas = createCanvas(preview.width || windowWidth, windowHeight);
  canvas.parent("previewContainer");

  // DOM
  inputText = select("#inputText");
  fontSize = select("#fontSize");
  colorText = select("#colorText");
  colorBG = select("#colorBG");
  textX = select("#textX");
  textY = select("#textY");
  weight = select("#weight");
  tracking = select("#tracking");
  blurSlider = select("#blur");
  scaleYInput = select("#scaleY");
  fontSelect = select("#fontSelect");
  spreadSlider = select("#spread");

  textFont(selectedFont);

  // Listeners
  inputText.input(() => { rebuildLetters(); drawMainText(); });
  fontSize.input(() => { rebuildLetters(); drawMainText(); });
  tracking.input(() => { rebuildLetters(); drawMainText(); });
  weight.input(() => { rebuildLetters(); drawMainText(); });
  spreadSlider.input(() => { rebuildLetters(); drawMainText(); });
  scaleYInput.input(() => {
    scaleYValue = Number(scaleYInput.value());
    drawMainText();
  });
  fontSelect.input(() => {
    selectedFont = fontSelect.value();
    textFont(selectedFont);
    rebuildLetters();
    drawMainText();
  });
  textX.input(() => { rebuildLetters(); drawMainText(); });
  textY.input(() => { rebuildLetters(); drawMainText(); });

  // Brush toggle
  let toggleBrushBtn = select("#toggleBrush");
  if (toggleBrushBtn) {
    toggleBrushBtn.mousePressed(() => {
      brushActive = !brushActive;
      toggleBrushBtn.html(brushActive ? "Brush Activé" : "Activer Brush");
    });
  }

  // Save buttons
  let savePNGBtn = select("#savePNG");
  let saveJPGBtn = select("#saveJPG");

  if (savePNGBtn) {
    savePNGBtn.mousePressed(() => saveCanvas("TextERA_export", "png"));
  }

  if (saveJPGBtn) {
    saveJPGBtn.mousePressed(() => saveCanvas("TextERA_export", "jpg"));
  }

  rebuildLetters();
  drawMainText();
}

// =======================================================
// BUILD LETTERS (SINGLE LINE ONLY)
// =======================================================
function rebuildLetters() {
  letters = [];

  let txt = inputText.value().replace(/\n/g, "");
  if (txt.length === 0) return;

  let fs = Number(fontSize.value());
  let offsetX = Number(textX.value());
  let offsetY = Number(textY.value());
  let boldFactor = map(Number(weight.value()), 100, 900, 1, 5);
  let track = Number(tracking.value());
  let spread = Number(spreadSlider.value() || 0);

  let charSpacing = fs * track + boldFactor * 1.8;
  let totalWidth = (txt.length - 1) * charSpacing;
  let baseX = -totalWidth / 2;

  let xCursor = baseX;

  for (let i = 0; i < txt.length; i++) {
    let sx = random(-spread, spread);
    let sy = random(-spread, spread);

    letters.push({
      char: txt[i],
      x: width / 2 + offsetX + xCursor + sx,
      y: height / 2 + offsetY + sy,
    });

    xCursor += charSpacing;
  }
}

// =======================================================
// DRAW MAIN TEXT
// =======================================================
function drawMainText() {
  if (!colorBG) return;

  background(color(colorBG.value()));

  let fs = Number(fontSize.value());
  let blurVal = Number(blurSlider.value());

  for (let l of letters) {
    push();
    textSize(fs);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(color(colorText.value()));

    if (blurVal > 0) {
      drawingContext.shadowBlur = blurVal * 2;
      drawingContext.shadowColor = color(colorText.value()).toString();
    } else {
      drawingContext.shadowBlur = 0;
    }

    scale(1, scaleYValue);
    noStroke();
    text(l.char, l.x, l.y);
    pop();
  }
}

// =======================================================
// BRUSH MODE
// =======================================================
function draw() {
  if (!brushActive || letters.length === 0) return;
  if (frameCount % 2 !== 0) return;

  let fs = Number(fontSize.value());
  let blurVal = Number(blurSlider.value());

  let centerX = 0;
  let centerY = 0;

  for (let l of letters) {
    centerX += l.x;
    centerY += l.y;
  }

  centerX /= letters.length;
  centerY /= letters.length;

  for (let l of letters) {
    drawLetterBrush(l, fs, blurVal, centerX, centerY);
  }
}

function drawLetterBrush(l, fs, blurVal, centerX, centerY) {
  push();
  textSize(fs);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  fill(color(colorText.value()));

  if (blurVal > 0) {
    drawingContext.shadowBlur = blurVal * 2;
    drawingContext.shadowColor = color(colorText.value()).toString();
  } else {
    drawingContext.shadowBlur = 0;
  }

  scale(1, scaleYValue);

  stroke(0);
  strokeWeight(2);

  let dx = l.x - centerX;
  let dy = l.y - centerY;

  let angle = frameCount * 0.02;
  let cosA = cos(angle);
  let sinA = sin(angle);

  let xRot = dx * cosA - dy * sinA;
  let yRot = dx * sinA + dy * cosA;

  text(l.char, mouseX + xRot, mouseY + yRot);
  pop();
}

// =======================================================
// RESIZE
// =======================================================
function windowResized() {
  let preview = select("#previewContainer");
  resizeCanvas(preview.width || windowWidth, windowHeight);
  rebuildLetters();
  drawMainText();
}
