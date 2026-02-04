import { Ticker } from 'pixi.js';
import renderer from './utils/renderer';
import torch from './utils/fire/torch';
import wall from './utils/fire/wall';
import knight from './utils/fire/knight';

export async function init() {
  const { container, app } = await renderer();

  const wallSprite = await wall();
  const { torch: torchSprite, animateFlame } = await torch();
  const {
    knight: knightContainer,
    animateFlame: animateKnightFlame,
    animateKnight,
  } = await knight();

  container.addChild(wallSprite);
  container.addChild(torchSprite);
  container.addChild(knightContainer);

  app.ticker.add((ticker: Ticker) => {
    animateFlame(ticker);
    animateKnightFlame(ticker);
    animateKnight(ticker);
  });
}

// Auto-run when loaded directly via script tag
init();
