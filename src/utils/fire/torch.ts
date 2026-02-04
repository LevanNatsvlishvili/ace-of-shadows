import { Assets, Container, Sprite } from 'pixi.js';
import { flame as flameUtils } from './flame';

async function torch() {
  const container = new Container();

  // Flame
  const { flame: flameSprite, animateFlame } = await flameUtils();
  flameSprite.position.y = -100;

  // Torch
  const torchTexture = await Assets.load('/fire/torch.png');
  const torchSprite = new Sprite(torchTexture);
  torchSprite.anchor.set(0.5);
  torchSprite.scale.set(0.5);
  torchSprite.position.set(0, 0);

  container.addChild(torchSprite);
  container.addChild(flameSprite);

  container.scale.set(0.25);

  return { torch: container, animateFlame };
}
export default torch;
