let inputText, fontSize, colorText, colorBG;
let textX, textY, lineSpacing, textAlignSel;
let weight, tracking, color1, color2, speed;
let blurSlider, vibration, scaleYInput, fontSelect;

let scaleYValue = 1;
let selectedFont = 'Arial'; // police par défaut
let gradientActive = true;
let toggleGradientBtn;

function setup() {
  let canvas = createCanvas(1560, 1025);
  canvas.parent("previewContainer");

  // DOM inputs
  inputText = select('#inputText');
  fontSize = select('#fontSize');
  colorText = select('#colorText');
  colorBG = select('#colorBG');
  textX = select('#textX');
  textY = select('#textY');
  lineSpacing = select('#lineSpacing');
  textAlignSel = select('#textAlign');
  weight = select('#weight');
  tracking = select('#tracking');
  color1 = select('#color1');
  color2 = select('#color2');
  speed = select('#speed');
  blurSlider = select('#blur');
  vibration = select('#vibration');
  scaleYInput = select('#scaleY');
  fontSelect = select('#fontSelect');

  textFont(selectedFont);
  textAlign(CENTER, CENTER);

  // Valeur par défaut lisible pour le slider tracking
  let minTrack = 0.50;
  if (Number(tracking.value()) < minTrack) {
    tracking.value(minTrack);
  }

  // ScaleY
  scaleYInput.input(() => {
    scaleYValue = scaleYInput.value();
  });

  // Changement de police
  fontSelect.input(() => {
    selectedFont = fontSelect.value();
    textFont(selectedFont);
  });

  // Bouton pour activer/désactiver gradient
  toggleGradientBtn = select('#toggleGradient');
  toggleGradientBtn.mousePressed(() => {
    gradientActive = !gradientActive;
    toggleGradientBtn.toggleClass('active');
  });
}

function draw() {
  background(colorBG.value());

  let txt = inputText.value();
  let fs = Number(fontSize.value());
  let xOffset = Number(textX.value());
  let yOffset = Number(textY.value());
  let spacing = fs * Number(lineSpacing.value());
  let vib = Number(vibration.value());
  let blurVal = Number(blurSlider.value());
  let track = Number(tracking.value()); // prend la valeur exacte du slider
  let t = millis() / 1000 * Number(speed.value());

  // Couleur texte (gradient dynamique ou couleur fixe)
  let txtColor;
  if (gradientActive) {
    let c1 = color(color1.value());
    let c2 = color(color2.value());
    txtColor = lerpColor(c1, c2, (sin(t) + 1) / 2);
  } else {
    txtColor = color(colorText.value());
  }
  fill(txtColor);

  // Flou
  if (blurVal > 0) {
    drawingContext.shadowBlur = blurVal * 2;
    drawingContext.shadowColor = txtColor.toString();
  } else {
    drawingContext.shadowBlur = 0;
  }

  push();
  translate(width / 2 + xOffset, height / 2 + yOffset);
  scale(1, scaleYValue);

  let lines = txt.split("\n");

  // Simulation du weight
  let boldFactor = map(Number(weight.value()), 100, 900, 1, 5);

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let y = i * spacing - ((lines.length - 1) * spacing) / 2;

    let charSpacing = fs * track;
    let charX = -((line.length - 1) * charSpacing) / 2;

    for (let j = 0; j < line.length; j++) {
      let ch = line[j];
      let vibX = random(-vib, vib);
      let vibY = random(-vib, vib);

      for (let b = 0; b < boldFactor; b++) {
        let offsetX = random(-0.5, 0.5);
        let offsetY = random(-0.5, 0.5);
        textSize(fs);
        text(ch, charX + vibX + offsetX, y + vibY + offsetY);
      }

      charX += charSpacing;
    }
  }

  pop();
}
