import { Assets, Sprite, Texture, Ticker } from 'pixi.js';

export async function flame() {
  const flameFrames: Texture[] = [
    await Assets.load('/fire/pixel-fire-1.png'),
    await Assets.load('/fire/pixel-fire-2.png'),
    await Assets.load('/fire/pixel-fire-3.png'),
    await Assets.load('/fire/pixel-fire-4.png'),
  ];

  const flameScale = 0.5;

  const flame = new Sprite(flameFrames[0]);
  flame.anchor.set(0.5, 1); // Anchor at bottom center
  flame.scale.set(flameScale); // Adjust scale as needed

  let frameIndex = 0;
  let frameTimer = 0;
  const frameSpeed = 8; // fire anime speed

  const animateFlame = (ticker: Ticker) => {
    const dt = ticker.deltaTime;

    frameTimer += dt;
    if (frameTimer >= frameSpeed) {
      frameTimer = 0;
      frameIndex = (frameIndex + 1) % flameFrames.length;
      flame.texture = flameFrames[frameIndex];
    }

    // Flicekring effect
    flame.alpha = 0.9 + Math.random() * 0.1;

    // Increase / decrease of flame size
    const pulse = flameScale + Math.sin(Date.now() * 0.005) * 0.005;
    flame.scale.set(pulse);
  };

  return { animateFlame, flame };
}
