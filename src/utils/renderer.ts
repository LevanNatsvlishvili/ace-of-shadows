import { Application, Container } from 'pixi.js';

// Singleton: only one app instance
let appInstance: Application | null = null;

interface InitProps {
  backgroundColor?: number;
}

const renderer = async (props: InitProps = {}) => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas');

  if (!canvas) {
    throw new Error('Canvas with id="canvas" not found in HTML');
  }

  // If app already exists, clear it and reuse
  if (appInstance) {
    // Remove all children from stage
    appInstance.stage.removeChildren();
  } else {
    // Create new app only once
    appInstance = new Application();

    await appInstance.init({
      canvas,
      resizeTo: window,
      backgroundAlpha: 0,
      backgroundColor: props?.backgroundColor || 0x000000, // default to black
      antialias: true,
    });

    appInstance.ticker.maxFPS = 60;
  }

  const container = new Container();
  appInstance.stage.addChild(container);

  const recenterContainer = () => {
    container.position.set(appInstance!.screen.width / 2, appInstance!.screen.height / 2);
  };

  recenterContainer();
  appInstance.renderer.on('resize', recenterContainer);

  return { app: appInstance, container };
};

export default renderer;
