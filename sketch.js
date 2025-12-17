let inputText, fontSize, colorText, colorBG;
let textX, textY, lineSpacing;
let weight, tracking, blurSlider, scaleYInput, fontSelect, spreadSlider;

let scaleYValue = 1;
let selectedFont = "Roboto Flex";
let brushActive = false;

let letters = []; // lettres du texte principal

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
  lineSpacing = select("#lineSpacing");
  weight = select("#weight");
  tracking = select("#tracking");
  blurSlider = select("#blur");
  scaleYInput = select("#scaleY");
  fontSelect = select("#fontSelect");
  spreadSlider = select("#spread");

  textFont(selectedFont);

  // Listeners : redessiner le texte à chaque changement
  inputText.input(() => { rebuildLetters(); drawMainText(); });
  fontSize.input(() => { rebuildLetters(); drawMainText(); });
  tracking.input(() => { rebuildLetters(); drawMainText(); });
  weight.input(() => { rebuildLetters(); drawMainText(); });
  lineSpacing.input(() => { rebuildLetters(); drawMainText(); });
  spreadSlider.input(() => { rebuildLetters(); drawMainText(); });
  scaleYInput.input(() => { scaleYValue = Number(scaleYInput.value()); drawMainText(); });
  fontSelect.input(() => { selectedFont = fontSelect.value(); textFont(selectedFont); drawMainText(); });
  textX.input(() => { rebuildLetters(); drawMainText(); });
  textY.input(() => { rebuildLetters(); drawMainText(); });

  // Brush Button
  let toggleBrushBtn = select("#toggleBrush");
  if(toggleBrushBtn){
    toggleBrushBtn.mousePressed(() => {
      brushActive = !brushActive;
      toggleBrushBtn.html(brushActive ? "Brush Activé" : "Activer Brush");
    });
  }

  // ✅ AJOUT : Boutons de sauvegarde
  let savePNGBtn = select("#savePNG");
  let saveJPGBtn = select("#saveJPG");

  if (savePNGBtn) {
    savePNGBtn.mousePressed(() => {
      saveCanvas('TextERA_export', 'png');
    });
  }

  if (saveJPGBtn) {
    saveJPGBtn.mousePressed(() => {
      saveCanvas('TextERA_export', 'jpg');
    });
  }

  rebuildLetters();
  drawMainText(); // dessine le texte initial
}

// Construit la position des lettres avec éclatement aléatoire
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

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let yLine = i * spacing - ((lines.length - 1) * spacing) / 2;

    let charSpacing = fs * track + boldFactor * 1.8;
    let totalWidth = (line.length - 1) * charSpacing;
    let baseX = -totalWidth / 2; // centré horizontalement

    let xCursor = baseX;

    for (let j = 0; j < line.length; j++) {
      let ch = line[j];

      // Éclatement aléatoire
      let sx = random(-spread, spread);
      let sy = random(-spread, spread);

      letters.push({
        char: ch,
        x: width / 2 + offsetX + xCursor + sx,
        y: height / 2 + offsetY + yLine + sy,
      });

      xCursor += charSpacing;
    }
  }
}

// Dessine le texte principal
function drawMainText() {
  if(!colorBG) return;
  background(color(colorBG.value()));

  let fs = Number(fontSize.value());
  let blurVal = Number(blurSlider.value());

  for (let l of letters){
    push();
    textSize(fs);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(color(colorText.value()));

    if(blurVal > 0){
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

// Draw pour le brush animé autour de la souris
function draw() {
  if(brushActive && frameCount % 2 === 0){
    let fs = Number(fontSize.value());
    let blurVal = Number(blurSlider.value());

    // Calcul centre du texte
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

  fill(color(colorText.value()));

  if(blurVal > 0){
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

function windowResized(){
  let preview = select("#previewContainer");
  resizeCanvas(preview.width || windowWidth, windowHeight);
  rebuildLetters();
  drawMainText();
}
