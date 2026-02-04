import { Assets, Sprite } from 'pixi.js';

export async function wall() {
  const wallTexture = await Assets.load('/fire/wall.png');
  const wallSprite = new Sprite(wallTexture);

  // Cover entire screen
  // wallSprite.anchor.set(0.5);
  wallSprite.scale.set(1);
  wallSprite.position.set(0, 0);
  wallSprite.x = -window.innerWidth / 2;
  wallSprite.y = -window.innerHeight / 2;

  return wallSprite;
}

export default wall;
