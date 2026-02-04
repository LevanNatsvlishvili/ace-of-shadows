import { Assets, Container, Sprite, Texture, Ticker } from 'pixi.js';
import torch from './torch';

export async function knight() {
  const container = new Container();

  // Load knight textures (still and moving frames)
  const knightStillTexture = await Assets.load('/fire/knight.png');
  const knightMovingTexture = await Assets.load('/fire/knight-moving-2.png');

  // Knight frames: still + moving with color adjustments to match
  const knightFrames: { texture: Texture; tint: number; scale: number }[] = [
    { texture: knightStillTexture, tint: 0xffffff, scale: 0.25 }, // Still - no tint
    { texture: knightMovingTexture, tint: 0xdddddd, scale: 0.25 }, // Moving - slightly darker to match
  ];

  // Create knight sprite starting with still pose
  const knightSprite = new Sprite(knightFrames[0].texture);
  knightSprite.anchor.set(0.5);
  knightSprite.scale.set(knightFrames[0].scale);
  knightSprite.tint = knightFrames[0].tint;
  knightSprite.position.set(0, 275);
  container.addChild(knightSprite);

  // Load torch
  const { torch: torchSprite, animateFlame } = await torch();
  torchSprite.position.set(100, 260);
  container.addChild(torchSprite);

  // Animation state
  let isMoving = false;
  let frameIndex = 0;
  let frameTimer = 0;
  const FRAME_SPEED = 15; // Frames between texture swaps when moving
  const MOVE_SPEED = 3; // Pixels per frame

  // Keyboard state
  const keys: Record<string, boolean> = {
    ArrowLeft: false,
    ArrowRight: false,
  };

  // Apply frame properties (texture, tint, scale)
  const applyFrame = (index: number) => {
    const frame = knightFrames[index];
    knightSprite.texture = frame.texture;
    knightSprite.tint = frame.tint;
    // Preserve direction when applying frame
    const direction = knightSprite.scale.x < 0 ? -1 : 1;
    knightSprite.scale.set(direction * frame.scale, frame.scale);
  };

  // Function to start/stop movement
  const setMoving = (moving: boolean) => {
    isMoving = moving;
    if (!moving) {
      // Reset to still pose
      frameIndex = 0;
      applyFrame(frameIndex);
    }
  };

  // Keyboard event listeners
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key in keys) {
      keys[e.key] = true;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key in keys) {
      keys[e.key] = false;
    }
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Animation function for knight movement
  const animateKnight = (ticker: Ticker) => {
    const dt = ticker.deltaTime;

    // Handle horizontal movement
    const movingLeft = keys.ArrowLeft;
    const movingRight = keys.ArrowRight;
    const shouldMove = movingLeft || movingRight;

    // console.log(shouldMove);
    if (shouldMove) {
      // Move position
      if (movingLeft) {
        container.x -= MOVE_SPEED * dt;
        // Flip sprite to face left
        if (container.scale.x < 0) {
          console.log('Left', container.scale.x);
          container.scale.x *= -1;
        }
      }
      if (movingRight) {
        container.x += MOVE_SPEED * dt;
        // Flip sprite to face right
        if (container.scale.x > 0) {
          console.log('Right', container.scale.x);
          container.scale.x *= -1;
        }
      }

      // Start walking animation if not already
      if (!isMoving) {
        setMoving(true);
      }
    } else {
      // Stop walking animation
      if (isMoving) {
        setMoving(false);
      }
    }

    // Frame animation when moving
    if (isMoving) {
      frameTimer += dt;
      if (frameTimer >= FRAME_SPEED) {
        frameTimer = 0;
        frameIndex = (frameIndex + 1) % knightFrames.length;
        applyFrame(frameIndex);
      }
    }
  };

  // Cleanup function to remove event listeners
  const destroy = () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };

  return {
    knight: container,
    knightSprite,
    animateFlame,
    animateKnight,
    setMoving,
    destroy,
  };
}

export default knight;
