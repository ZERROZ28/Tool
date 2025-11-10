const inputText = document.getElementById('inputText');
const preview = document.getElementById('preview');
inputText.addEventListener('input', () => preview.textContent = inputText.value);

//Épaisseur
const weight = document.getElementById('weight');

weight.addEventListener('input', () => {
  preview.style.fontVariationSettings = `'wght' ${weight.value}`;
});

//Espacement
const tracking = document.getElementById('tracking');

tracking.addEventListener('input', () => {
  preview.style.letterSpacing = `${tracking.value}em`;
});

//Couleurs
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const speed = document.getElementById('speed');

color1.addEventListener('input', () => preview.style.setProperty('--c1', color1.value));
color2.addEventListener('input', () => preview.style.setProperty('--c2', color2.value));
speed.addEventListener('input', () => preview.style.animationDuration = `${speed.value}s`);

//Flou
const blur = document.getElementById('blur');
blur.addEventListener('input', () => {
  const v = blur.value;
  preview.style.filter = `blur(${v}px)`;
  // intensifier le glow en même temps
  preview.style.textShadow = v > 0 ? `0 0 ${v*6}px ${getComputedStyle(preview).getPropertyValue('--c2') || '#00ffff'}` : 'none';
});

//Vibration
const vibration = document.getElementById('vibration');
vibration.addEventListener('input', () => preview.style.setProperty('--vib', `${vibration.value}px`));

//Librairie de typo
const scaleYInput = document.getElementById('scaleY');
const fontSelect = document.getElementById('fontSelect');

let scaleYValue = 1;
let selectedFont = "'Roboto Flex', sans-serif";

// Met à jour la police
fontSelect.addEventListener('change', () => {
  selectedFont = fontSelect.value;
  preview.style.fontFamily = selectedFont;
});

// Fonction de mise à jour
function updateTransform() {
  preview.style.transform = `scaleY(${scaleYValue})`;
}

// Initialisation
updateTransform();
