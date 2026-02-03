import { Assets, Sprite } from 'pixi.js';

const iphoneLoader = async () => {
  const texture = await Assets.load('/dialogue/iphone.jpg');
  const iphone = new Sprite(texture);

  // Anchor at top-left for simpler positioning
  iphone.anchor.set(0, 0);
  iphone.x = 0;
  iphone.y = 0;

  function fitToScreen() {
    // Scale to fit screen height, maintain aspect ratio
    const scale = window.innerHeight / texture.height;
    iphone.scale.set(scale);
    // Center horizontally
    iphone.x = (window.innerWidth - texture.width * scale) / 2;
  }

  fitToScreen();
  window.addEventListener('resize', fitToScreen);

  return iphone;
};

export default iphoneLoader;
