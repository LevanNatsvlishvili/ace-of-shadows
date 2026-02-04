import { Ticker } from 'pixi.js';
import renderer from './utils/renderer';
import wall from './utils/fire/wall';
import knight from './utils/fire/knight';

function createArrowControls() {
  // Container for arrow buttons
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'arrow-controls';
  controlsDiv.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    display: flex;
    gap: 10px;
    z-index: 1000;
  `;

  // Helper to create arrow button
  const createArrowBtn = (key: string, label: string) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `
      width: 60px;
      height: 60px;
      font-size: 24px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      cursor: pointer;
      user-select: none;
      display:flex;
      justify-content: center;
      -webkit-user-select: none;
      touch-action: manipulation;
    `;

    // Dispatch keyboard events on press/release
    const dispatchKey = (type: 'keydown' | 'keyup') => {
      window.dispatchEvent(new KeyboardEvent(type, { key }));
    };

    btn.addEventListener('mousedown', () => dispatchKey('keydown'));
    btn.addEventListener('mouseup', () => dispatchKey('keyup'));
    btn.addEventListener('mouseleave', () => dispatchKey('keyup'));
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dispatchKey('keydown');
    });
    btn.addEventListener('touchend', () => dispatchKey('keyup'));

    return btn;
  };

  controlsDiv.appendChild(createArrowBtn('ArrowLeft', '←'));
  controlsDiv.appendChild(createArrowBtn('ArrowRight', '→'));

  document.body.appendChild(controlsDiv);

  return controlsDiv;
}

export async function init() {
  const { container, app } = await renderer();

  const { wall: wallSprite } = await wall();
  const {
    knight: knightContainer,
    animateFlame: animateKnightFlame,
    animateKnight,
  } = await knight();

  container.addChild(wallSprite);
  container.addChild(knightContainer);

  // Add arrow controls to DOM
  createArrowControls();

  // Move view up on mobile only (for fire)
  const MOBILE_BREAKPOINT = 768;
  const MOBILE_VIEW_OFFSET_Y = -50;

  const adjustForMobile = () => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    container.y = app.screen.height / 2 + (isMobile ? MOBILE_VIEW_OFFSET_Y : 0);
  };

  adjustForMobile();
  window.addEventListener('resize', adjustForMobile);

  app.ticker.add((ticker: Ticker) => {
    animateKnightFlame(ticker);
    animateKnight(ticker);
  });
}
