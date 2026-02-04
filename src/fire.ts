import { Ticker } from 'pixi.js';
import renderer from './utils/renderer';
import wall from './utils/fire/wall';
import knight from './utils/fire/knight';

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

  app.ticker.add((ticker: Ticker) => {
    animateKnightFlame(ticker);
    animateKnight(ticker);
  });
}

init();
