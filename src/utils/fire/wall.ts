import { Assets, Sprite } from 'pixi.js';
import { Graphics } from 'pixi.js';

export async function wall() {
  const wallTexture = await Assets.load('/fire/wall.png');
  const wallSprite = new Sprite(wallTexture);

  const shadow = new Graphics().rect(0, 0, window.innerWidth, window.innerHeight).fill(0x000000);

  shadow.alpha = 0.4; // darkness strength

  wallSprite.addChild(shadow);

  wallSprite.scale.set(1);
  wallSprite.position.set(0, 0);
  wallSprite.x = -window.innerWidth / 2;
  wallSprite.y = -window.innerHeight / 2;

  return { wall: wallSprite };
}

export default wall;
