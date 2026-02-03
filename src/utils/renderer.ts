import { Application, Container } from 'pixi.js';

const renderer = async () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas');

  if (!canvas) {
    throw new Error('Canvas with id="canvas" not found in HTML');
  }

  const app = new Application();

  await app.init({
    canvas, // tell Pixi which canvas to use
    resizeTo: window, // auto resize when window changes
    backgroundAlpha: 0, // transparent background
    antialias: true, // smoother edges
  });

  const container = new Container();

  app.stage.addChild(container);

  const recenterContainer = () => {
    container.position.set(app.screen.width / 2, app.screen.height / 2);
  };

  // Initial center and on-resize center (after Pixi resizes the renderer).
  recenterContainer();
  app.renderer.on('resize', recenterContainer);

  return { app, container };
};

export default renderer;
