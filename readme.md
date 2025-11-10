# Générateur de texte ultra‑personnalisable

Cet outil est un générateur visuel interactif dédié à la **création de
textes artistiques** entièrement modulables en temps réel. Pensé pour
les designers, directeurs artistiques, etc., il permet de transformer un
simple mot ou phrase en **objet graphique expressif prêt à être
exporté**.

## Références

- [Type Tools](https://www.type-tools.com)
- [NoDesignFoundry](https://nodesignfoundry.com)
- [Velvetyne](https://velvetyne.fr)
- [pointilliser](https://pointilliser.elwyn.co)

## Snippets

-   **Saisie libre de texte** (mot, phrase, slogan, titre)

-   **Contrôles en temps réel sur :**

    -   Couleurs dynamiques
    -   Épaisseur de trait / volume / graisse variable
    -   Hauteur / tracking / étirement / distortion
    -   Spirales typographiques / courbure libre
    -   Effets de vibration / bruit / instabilité organique
    -   Effet 3D simulé (profondeur / ombre / extrusion)
    -   Flou animé ou statique (glow / blur / fade)

-   **Système de presets & random**

-   **Export haute qualité** : PNG, JPG, SVG (vectoriel)

**Quelques snippets à tester :**

*1. Vibration*

```
const vibration = document.getElementById('vibration');
vibration.addEventListener('input', () => preview.style.setProperty('--vib', `${vibration.value}px`));
```
*2. Flou*

```
const blur = document.getElementById('blur');
blur.addEventListener('input', () => {
  const v = blur.value;
  preview.style.filter = `blur(${v}px)`;
  // intensifier le glow en même temps
  preview.style.textShadow = v > 0 ? `0 0 ${v*6}px ${getComputedStyle(preview).getPropertyValue('--c2') || '#00ffff'}` : 'none';
});
```

*3. 3D, Profondeur*

```
const depth = document.getElementById('depth');

// fonction utilitaire pour interpoler entre deux couleurs hex
function lerpColor(a, b, amount) {
  const ah = parseInt(a.replace('#', ''), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const bh = parseInt(b.replace('#', ''), 16);
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + amount * (br - ar));
  const rg = Math.round(ag + amount * (bg - ag));
  const rb = Math.round(ab + amount * (bb - ab));
  return `rgb(${rr},${rg},${rb})`;
}

function updateDepthEffect() {
  const d = +depth.value;
  const c1 = color1.value;
  const c2 = color2.value;
  const layers = [];

  for (let i = 1; i <= d; i++) {
    const t = i / d; // interpolation
    const c = lerpColor(c1, c2, t);
    const alpha = 0.8 - t * 0.7; // plus transparent avec la profondeur
    layers.push(`${i}px ${i}px 0 rgba(${hexToRgbString(c)}, ${alpha})`);
  }
  preview.style.textShadow = layers.join(',');
}

// convertit rgb(...) en version sans alpha pour lerpColor
function hexToRgbString(rgbStr) {
  // extrait les chiffres de "rgb(r,g,b)"
  const match = rgbStr.match(/\d+/g);
  return match.slice(0,3).join(',');
}

// Événements
[depth, color1, color2].forEach(el => el.addEventListener('input', updateDepthEffect));
```

## Utilisation

-   Création d'affiches / visuels / titres impactants
-   Génération d'identités visuelles typographiques ultra expressives
-   Assets pour motion, web, réseaux sociaux, print, scénographie
-   Moodboards et concepts forts en quelques secondes

------------------------------------------------------------------------

## Objectif créatif

Proposer un **outil typographique expressif**, permettant un niveau de
personnalisation complet mais accessible --- un pont entre l'instrument
visuel et l'outil de production pour créatifs.

------------------------------------------------------------------------

## Prochaines étapes (suggestions)

-   Prototype p5.js interactif (UI + export SVG/PNG)
-   Ajout d'un système de seeds et presets partageables
-   Mode export vidéo (MP4 / GIF) et séquences image
-   Intégration MIDI / audio-réactivité pour performance live
