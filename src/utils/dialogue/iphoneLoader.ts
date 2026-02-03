import { Assets, Sprite } from 'pixi.js';

const iphoneLoader = async () => {
  const texture = await Assets.load('/dialogue/iphone.jpg');
  const iphone = new Sprite(texture);

  const iphoneTopTexture = await Assets.load('/dialogue/iphone-top.jpg');
  const iphoneTop = new Sprite(iphoneTopTexture);

  // Anchor at top-left for simpler positioning
  iphone.anchor.set(0, 0);
  iphone.x = 0;
  iphone.y = 0;

  iphoneTop.anchor.set(0, 0);
  iphoneTop.x = 0;
  iphoneTop.y = 0;

  function fitToScreen() {
    // Scale to fit screen height, maintain aspect ratio
    const scale = window.innerHeight / texture.height;
    const widthScale = window.innerWidth / texture.width / 2;
    iphone.scale.set(widthScale, scale);
    iphoneTop.scale.set(widthScale, scale);
    // Center horizontally, assign minimum width of 600px
    iphone.x = window.innerWidth / 2 - (texture.width * widthScale) / 2;
    // iphone.x = window.innerWidth - texture.width * scale;
    iphoneTop.x = iphone.x;
  }

  fitToScreen();
  window.addEventListener('resize', fitToScreen);

  return { iphone, iphoneTop };
};

export default iphoneLoader;
