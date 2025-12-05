let inputText, fontSize, colorText, colorBG;
let textX, textY, lineSpacing, textAlignSel;
let weight, tracking, color1, color2, speed;
let blurSlider, scaleYInput, fontSelect, spreadSlider;

let scaleYValue = 1;
let selectedFont = "Roboto Flex";
let gradientActive = false;
let brushActive = false;

let letters = []; // lettres du texte principal

function setup() {
  let preview = select("#previewContainer");
  let canvas = createCanvas(preview.width, windowHeight);
  canvas.parent("previewContainer");

  // DOM
  inputText = select("#inputText");
  fontSize = select("#fontSize");
  colorText = select("#colorText");
  colorBG = select("#colorBG");
  textX = select("#textX");
  textY = select("#textY");
  lineSpacing = select("#lineSpacing");
  textAlignSel = select("#textAlign");
  weight = select("#weight");
  tracking = select("#tracking");
  color1 = select("#color1");
  color2 = select("#color2");
  speed = select("#speed");
  blurSlider = select("#blur");
  scaleYInput = select("#scaleY");
  fontSelect = select("#fontSelect");
  spreadSlider = select("#spread");

  textFont(selectedFont);

  // Listeners : à chaque changement, on redessine le texte principal
  inputText.input(drawMainText);
  fontSize.input(drawMainText);
  tracking.input(drawMainText);
  weight.input(drawMainText);
  lineSpacing.input(drawMainText);
  spreadSlider.input(drawMainText);
  scaleYInput.input(drawMainText);
  fontSelect.input(() => { selectedFont = fontSelect.value(); textFont(selectedFont); drawMainText(); });

  // Brush Button
  let toggleBrushBtn = select("#toggleBrush");
  if(toggleBrushBtn){
    toggleBrushBtn.mousePressed(() => {
      brushActive = !brushActive;
      toggleBrushBtn.html(brushActive ? "Brush Activé" : "Activer Brush");
    });
  }

  // Gradient Button
  let gradientBtn = select("#toggleGradient");
  if(gradientBtn){
    gradientBtn.mousePressed(() => gradientActive = !gradientActive);
  }

  rebuildLetters();
  drawMainText(); // dessine le texte initial une première fois
}

// Construit la position des lettres
function rebuildLetters() {
  letters = [];
  let txt = inputText.value();
  let fs = Number(fontSize.value());
  let offsetX = Number(textX.value());
  let offsetY = Number(textY.value());
  let spacing = fs * Number(lineSpacing.value());
  let boldFactor = map(Number(weight.value()), 100, 900, 1, 5);
  let track = Number(tracking.value());
  let spread = Number(spreadSlider.value() || 0);

  let lines = txt.split("\n");
  let align = textAlignSel.value() === "LEFT" ? LEFT : textAlignSel.value() === "RIGHT" ? RIGHT : CENTER;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let yLine = i * spacing - ((lines.length - 1) * spacing) / 2;

    let charSpacing = fs * track + boldFactor * 1.8;
    let totalWidth = (line.length - 1) * charSpacing;
    let baseX = 0;
    if(align === CENTER) baseX = -totalWidth / 2;
    else if(align === RIGHT) baseX = -totalWidth;

    let xCursor = baseX;

    for (let j = 0; j < line.length; j++) {
      let ch = line[j];
      let sx = map(j, 0, line.length - 1, -spread, spread);

      letters.push({
        char: ch,
        x: width / 2 + offsetX + xCursor + sx + random(-2,2),
        y: height / 2 + offsetY + yLine + random(-2,2),
      });

      xCursor += charSpacing;
    }
  }
}

// Dessine le texte initial UNE seule fois (réactif aux mutateurs)
function drawMainText() {
  if(!colorBG) return;
  // Dessine le fond une fois
  background(color(colorBG.value()));

  let fs = Number(fontSize.value());
  let blurVal = Number(blurSlider.value());

  for (let l of letters){
    push();
    textSize(fs);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);

    if(gradientActive){
      let c1 = color(color1.value());
      let c2 = color(color2.value());
      fill(lerpColor(c1, c2, random()));
    } else {
      fill(color(colorText.value()));
    }

    if(blurVal > 0){
      drawingContext.shadowBlur = blurVal * 2;
      drawingContext.shadowColor = getFillColor().toString();
    } else {
      drawingContext.shadowBlur = 0;
    }

    scale(1, scaleYValue);
    noStroke();
    text(l.char, l.x, l.y);
    pop();
  }
}

// Draw ne dessine que le brush
function draw() {
  if(brushActive && frameCount % 2 === 0){
    let fs = Number(fontSize.value());
    let blurVal = Number(blurSlider.value());

    // Centre du texte
    let centerX = 0, centerY = 0;
    for (let l of letters){
      centerX += l.x;
      centerY += l.y;
    }
    centerX /= letters.length;
    centerY /= letters.length;

    for(let l of letters){
      drawLetterBrush(l, fs, blurVal, centerX, centerY);
    }
  }
}

function drawLetterBrush(l, fs, blurVal, centerX, centerY){
  push();
  textSize(fs);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  if(gradientActive){
    let c1 = color(color1.value());
    let c2 = color(color2.value());
    fill(lerpColor(c1, c2, random()));
  } else {
    fill(color(colorText.value()));
  }

  if(blurVal > 0){
    drawingContext.shadowBlur = blurVal * 2;
    drawingContext.shadowColor = getFillColor().toString();
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

function getFillColor(){
  return gradientActive ? lerpColor(color(color1.value()), color(color2.value()), random()) : color(colorText.value());
}

function windowResized(){
  let preview = select("#previewContainer");
  resizeCanvas(preview.width, windowHeight);
  rebuildLetters();
  drawMainText(); // redraw texte initial après resize
}
