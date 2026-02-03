import { Assets, Sprite } from 'pixi.js';

const tableLoader = async () => {
  const tex = await Assets.load('/aces-of-shadows/table-texture.jpg');
  const table = new Sprite(tex);
  table.anchor.set(1);

  function coverScreen() {
    const sw = window.innerWidth;
    const sh = window.innerHeight;

    // center it
    table.x = sw / 2;
    table.y = sh / 2;

    // scale to cover screen (like CSS background-size: cover)
    const scale = Math.max(sw / tex.width, sh / tex.height);
    table.scale.set(scale);
  }

  coverScreen();
  window.addEventListener('resize', coverScreen);

  return table;
};

export default tableLoader;
