import { Ticker } from 'pixi.js';
import renderer from './utils/renderer';
import { torch } from './utils/fire/torch';

export async function init() {
  const { container, app } = await renderer();

  // const { animateFlame, flame: flameSprite } = await flame();
  const { torch: torchSprite, animateFlame } = await torch();
  // container.addChild(flameSprite);
  container.addChild(torchSprite);
  app.ticker.add((ticker: Ticker) => {
    animateFlame(ticker);
  });
}

// Auto-run when loaded directly via script tag
init();
