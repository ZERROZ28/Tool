let inputText, fontSize, colorText, colorBG;
let textX, textY;
let weight, tracking, blurSlider, scaleYInput, fontSelect, spreadSlider;

let scaleYValue = 1;
let selectedFont = "Roboto Flex";
let brushActive = false;

let letters = [];
let textBuffer;
let brushBuffer;

function setup() {
  let preview = select("#previewContainer");
  let canvas = createCanvas(preview.width || windowWidth, windowHeight);
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
  tracking = select("#tracking");
  blurSlider = select("#blur");
  scaleYInput = select("#scaleY");
  fontSelect = select("#fontSelect");
  spreadSlider = select("#spread");

  textFont(selectedFont);

  // Listeners : mise à jour des valeurs seulement
  [
    inputText, fontSize, tracking, weight, spreadSlider, textX, textY
  ].forEach(el => el.input(rebuildLetters));

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
  let boldFactor = map(Number(weight.value()), 100, 900, 1, 5);
  let track = Number(tracking.value());
  let spread = Number(spreadSlider.value() || 0);

  let charSpacing = fs * track + boldFactor * 1.8;
  let totalWidth = (txt.length - 1) * charSpacing;
  let baseX = -totalWidth / 2;

  let xCursor = baseX;
  for (let i=0;i<txt.length;i++){
    letters.push({
      char: txt[i],
      x: width/2 + offsetX + xCursor + random(-spread, spread),
      y: height/2 + offsetY + random(-spread, spread)
    });
    xCursor += charSpacing;
  }
}

function draw() {
  // Redessine le texte
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

  for (let l of letters){
    textBuffer.push();
    textBuffer.translate(l.x,l.y);
    textBuffer.scale(1, scaleYValue);
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
  let dx = l.x-cx;
  let dy = l.y-cy;
  let a = frameCount*0.02;
  let x = dx*cos(a)-dy*sin(a);
  let y = dx*sin(a)+dy*cos(a);

  brushBuffer.push();
  brushBuffer.translate(mouseX+x, mouseY+y);
  brushBuffer.scale(1, scaleYValue);

  brushBuffer.textSize(fs);
  brushBuffer.textStyle(BOLD);
  brushBuffer.textAlign(CENTER,CENTER);

  if(blurVal>0){
    brushBuffer.drawingContext.filter = `blur(${blurVal}px)`;
    brushBuffer.fill(col);
    brushBuffer.text(l.char,0,0);
  }

  brushBuffer.drawingContext.filter = "none";
  brushBuffer.stroke(0);
  brushBuffer.strokeWeight(2);
  brushBuffer.fill(col);
  brushBuffer.text(l.char,0,0);
  brushBuffer.pop();
}

function windowResized(){
  let preview = select("#previewContainer");
  resizeCanvas(preview.width || windowWidth, windowHeight);
  textBuffer.resizeCanvas(width,height);
  brushBuffer.resizeCanvas(width,height);
  brushBuffer.clear();
  rebuildLetters();
}
