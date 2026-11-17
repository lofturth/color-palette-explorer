import { clampChroma, converter, formatHex, parse } from 'culori';
import './style.css';

const toOklch = converter('oklch');
const form = document.querySelector('#generator');
const input = document.querySelector('#color');
const error = document.querySelector('#error');
const palettes = document.querySelector('#palettes');

// Each row pairs lightness, chroma multiplier, and hue offset in OKLCH.
const recipes = [
  ['Tonal study', [[.23,.55,0],[.39,.8,0],[.55,1,0],[.72,.75,0],[.9,.35,0]]],
  ['Softly spoken', [[.38,.55,-12],[.62,.55,0],[.78,.4,12],[.88,.25,25],[.95,.12,0]]],
  ['Deep & vivid', [[.22,.7,-15],[.35,1,0],[.5,1.2,8],[.65,1.1,18],[.8,.65,25]]],
  ['Nearby hues', [[.42,.85,-45],[.55,1,-25],[.64,1,0],[.73,.8,25],[.84,.55,45]]],
  ['Warm neighbors', [[.35,.75,-35],[.52,1,-18],[.66,1,0],[.78,.7,18],[.9,.35,35]]],
  ['Cool neighbors', [[.3,.65,45],[.46,.9,30],[.6,1,15],[.74,.8,0],[.88,.4,-15]]],
  ['Opposites attract', [[.33,.8,180],[.55,.8,180],[.88,.2,0],[.68,.9,0],[.43,.9,0]]],
  ['Split complement', [[.34,.75,150],[.63,.75,150],[.88,.2,0],[.65,.9,0],[.48,.85,210]]],
  ['Three-way harmony', [[.4,.8,120],[.69,.7,120],[.87,.25,0],[.63,1,0],[.48,.8,240]]],
  ['Earth & sky', [[.28,.55,180],[.5,.55,180],[.9,.18,35],[.72,.65,0],[.5,.8,0]]],
  ['Gentle contrast', [[.38,.55,210],[.68,.45,180],[.93,.12,0],[.79,.4,0],[.57,.7,0]]],
  ['Bright accents', [[.26,.65,0],[.5,.95,0],[.75,.75,30],[.84,.5,150],[.58,.85,210]]],
];

function generate(value) {
  const text = value.trim().toLowerCase();
  const allowed = /^#[\da-f]{3}([\da-f]{3})?$/i.test(text) || /^[a-z]+$/.test(text);
  const color = allowed ? parse(text === 'terracotta' ? '#c67d65' : text) : undefined;
  if (!color || color.alpha !== undefined) {
    error.textContent = 'We couldn’t recognize that color. Try a name like green or a HEX code like #c67d65.';
    input.setAttribute('aria-invalid', 'true');
    return;
  }
  error.textContent = '';
  input.removeAttribute('aria-invalid');
  const base = toOklch(color);
  // Neutral colors have no defined hue; use a gentle warm hue for their harmonies.
  const hue = Number.isFinite(base.h) ? base.h : 35;
  const chroma = Math.max(base.c || 0, .06);
  palettes.replaceChildren(...recipes.map(([label, colors], index) => {
    const article = document.createElement('article');
    article.className = 'palette-card';
    const heading = document.createElement('div');
    heading.className = 'palette-heading';
    const title = document.createElement('h3');
    title.textContent = label;
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    heading.append(title, number);
    const row = document.createElement('div');
    row.className = 'palette';
    colors.forEach(([lightness, saturation, offset]) => {
      const swatch = document.createElement('div');
      const hex = formatHex(clampChroma({ mode: 'oklch', l: lightness, c: chroma * saturation, h: hue + offset }, 'oklch', 'rgb'));
      swatch.className = 'swatch';
      swatch.style.backgroundColor = hex;
      swatch.setAttribute('aria-label', hex);
      row.append(swatch);
    });
    article.append(heading, row);
    return article;
  }));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  generate(input.value);
});
generate(input.value);
