import { Assets, Sprite, Container, Graphics } from 'pixi.js';

export async function wall() {
  const root = new Container();

  const wallTexture = await Assets.load('/fire/wall.png');
  const wallSprite = new Sprite(wallTexture);
  wallSprite.anchor.set(0.5);
  root.addChild(wallSprite);

  // Scale wall to cover entire screen
  const scaleToFit = () => {
    const scaleX = window.innerWidth / wallSprite.texture.width;
    const scaleY = window.innerHeight / wallSprite.texture.height;
    // Use the larger scale to cover entire screen (cover mode)
    const scale = Math.max(scaleX, scaleY);
    wallSprite.scale.set(scale);
  };

  scaleToFit();
  window.addEventListener('resize', scaleToFit);

  // Dark overlay
  const shadow = new Graphics();
  const drawShadow = () => {
    shadow.clear();
    shadow.rect(-window.innerWidth, -window.innerHeight, window.innerWidth * 2, window.innerHeight * 2);
    shadow.fill({ color: 0x000000, alpha: 0.4 });
  };
  drawShadow();
  window.addEventListener('resize', drawShadow);
  root.addChild(shadow);

  return { wall: root, wallSprite, shadow };
}

export default wall;
