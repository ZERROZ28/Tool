let inputText, fontSize, colorText, colorBG;
let textX, textY;
let weight, scaleXInput, blurSlider, scaleYInput, fontSelect, spreadSlider;

let scaleXValue = 1;
let scaleYValue = 1;
let selectedFont = "Roboto Flex";
let brushActive = false;

let letters = [];
let textBuffer;
let brushBuffer;

function setup() {
  // largeur du canvas = largeur fenêtre - largeur panneau
  let panel = select(".panel");
  let canvasWidth = panel ? windowWidth - panel.width : windowWidth;
  let canvasHeight = windowHeight;

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("previewContainer");

  // Buffers
  textBuffer = createGraphics(width, height);
  brushBuffer = createGraphics(width, height);
  brushBuffer.clear();

  // DOM
  inputText = select("#inputText");
  fontSize = select("#fontSize");
  colorText = select("#colorText");
  colorBG = select("#colorBG");
  textX = select("#textX");
  textY = select("#textY");
  weight = select("#weight");
  scaleXInput = select("#tracking"); // remplace tracking
  blurSlider = select("#blur");
  scaleYInput = select("#scaleY");
  fontSelect = select("#fontSelect");
  spreadSlider = select("#spread");

  textFont(selectedFont);

  // Listeners : mise à jour des valeurs seulement
  [
    inputText, fontSize, textX, textY, weight, spreadSlider
  ].forEach(el => el.input(rebuildLetters));

  scaleXInput.input(() => scaleXValue = Number(scaleXInput.value()));
  scaleYInput.input(() => scaleYValue = Number(scaleYInput.value()));
  fontSelect.input(() => { selectedFont = fontSelect.value(); textFont(selectedFont); rebuildLetters(); });

  // Brush toggle
  let toggleBrushBtn = select("#toggleBrush");
  if (toggleBrushBtn) {
    toggleBrushBtn.mousePressed(() => {
      brushActive = !brushActive;
      toggleBrushBtn.html(brushActive ? "Brush Activé" : "Activer Brush");
    });
  }

  // Save buttons
  select("#savePNG")?.mousePressed(() => saveCanvas("TextERA_export","png"));
  select("#saveJPG")?.mousePressed(() => saveCanvas("TextERA_export","jpg"));

  rebuildLetters();
}

function rebuildLetters() {
  letters = [];
  let txt = inputText.value().replace(/\n/g,"");
  if (!txt) return;

  let fs = Number(fontSize.value());
  let offsetX = Number(textX.value());
  let offsetY = Number(textY.value());

  textBuffer.textFont(selectedFont);
  textBuffer.textSize(fs);
  textBuffer.textStyle(BOLD);

  // Calcule la largeur totale du texte (avant étirement)
  let totalWidth = 0;
  for (let i = 0; i < txt.length; i++) {
    totalWidth += textBuffer.textWidth(txt[i]);
  }

  let baseX = width / 2 - totalWidth / 2 + offsetX;
  let xCursor = baseX;

  for (let i = 0; i < txt.length; i++) {
    let w = textBuffer.textWidth(txt[i]);

    letters.push({
      char: txt[i],
      x: xCursor + w/2, // centre de la lettre
      y: height/2 + offsetY
    });

    xCursor += w; // passe à la prochaine lettre
  }
}

function draw() {
  // Redessine le texte principal
  drawMainText();

  // Dessine le buffer brush par-dessus
  image(brushBuffer, 0, 0);

  // Ajoute de nouvelles lettres au brush si activé
  if(brushActive && letters.length > 0 && frameCount % 2 === 0){
    let fs = Number(fontSize.value());
    let blurVal = Number(blurSlider.value());
    let col = color(colorText.value());

    let centerX = letters.reduce((acc,l)=>acc+l.x,0)/letters.length;
    let centerY = letters.reduce((acc,l)=>acc+l.y,0)/letters.length;

    for (let l of letters){
      drawLetterBrush(l, fs, blurVal, centerX, centerY, col);
    }
  }
}

function drawMainText(){
  background(color(colorBG.value()));

  textBuffer.clear();
  textBuffer.textFont(selectedFont);
  textBuffer.textAlign(CENTER, CENTER);
  textBuffer.textStyle(BOLD);

  let fs = Number(fontSize.value());
  let blurVal = Number(blurSlider.value());
  let col = color(colorText.value());
  let spread = Number(spreadSlider.value()); // appliquer aussi sur le texte principal si voulu

  for (let l of letters){
    let offsetX = random(-spread, spread);
    let offsetY = random(-spread, spread);

    textBuffer.push();
    textBuffer.translate(l.x + offsetX, l.y + offsetY);
    textBuffer.scale(scaleXValue, scaleYValue); // applique scaleX et scaleY
    textBuffer.textSize(fs);
    textBuffer.fill(col);
    textBuffer.noStroke();
    textBuffer.text(l.char,0,0);
    textBuffer.pop();
  }

  if (blurVal>0){
    textBuffer.filter(BLUR, blurVal);
  }

  image(textBuffer,0,0);
}

function drawLetterBrush(l, fs, blurVal, cx, cy, col){
  let spread = Number(spreadSlider.value());

  // Position relative au centre + spread
  let dx = l.x - cx;
  let dy = l.y - cy;
  let offsetX = random(-spread, spread);
  let offsetY = random(-spread, spread);

  // rotation autour du centre
  let a = frameCount * 0.02;
  let x = (dx + offsetX) * cos(a) - (dy + offsetY) * sin(a);
  let y = (dx + offsetX) * sin(a) + (dy + offsetY) * cos(a);

  brushBuffer.push();
  brushBuffer.translate(mouseX + x, mouseY + y);
  brushBuffer.scale(scaleXValue, scaleYValue);

  brushBuffer.textSize(fs);
  brushBuffer.textStyle(BOLD);
  brushBuffer.textAlign(CENTER, CENTER);

  if(blurVal > 0){
    brushBuffer.drawingContext.filter = `blur(${blurVal}px)`;
    brushBuffer.fill(col);
    brushBuffer.text(l.char, 0, 0);
  }

  brushBuffer.drawingContext.filter = "none";
  brushBuffer.stroke(0);
  brushBuffer.strokeWeight(2);
  brushBuffer.fill(col);
  brushBuffer.text(l.char, 0, 0);
  brushBuffer.pop();
}

function windowResized(){
  let panel = select(".panel");
  let canvasWidth = panel ? windowWidth - panel.width : windowWidth;
  let canvasHeight = windowHeight;

  resizeCanvas(canvasWidth, canvasHeight);
  textBuffer.resizeCanvas(width,height);
  brushBuffer.resizeCanvas(width,height);
  brushBuffer.clear();

  rebuildLetters();
}
