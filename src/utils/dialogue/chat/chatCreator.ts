import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';

type Side = 'left' | 'right';

type ChatMessageOptions = {
  text: string;
  side?: Side; // left = incoming, right = outgoing
  maxBubbleWidthidth?: number; // wrap width
  avatarTexture?: Texture; // optional: provide an avatar image
  avatarSize?: number;
};

export function createChatMessage({
  text,
  side = 'left',
  maxBubbleWidthidth = 260,
  avatarTexture,
  avatarSize = 44,
}: ChatMessageOptions) {
  const root = new Container();

  // ----- Avatar -----
  const avatarContainer = new Container();

  // Background circle (in case image missing)
  const avatarBg = new Graphics().circle(0, 0, avatarSize / 2).fill(0x777777);

  avatarContainer.addChild(avatarBg);

  // Optional avatar image cropped to circle
  if (avatarTexture) {
    const avatar = new Sprite(avatarTexture);

    console.log(avatar);
    avatar.anchor.set(0.5);
    avatar.width = avatarSize;
    avatar.height = avatarSize;

    // Mask to make it circular
    const mask = new Graphics().circle(0, 0, avatarSize / 2).fill(0xffffff);
    avatar.mask = mask;

    avatarContainer.addChild(avatar);
    avatarContainer.addChild(mask);
  }

  // ----- Text -----
  const messageText = new Text({
    text,
    style: {
      fontSize: 18,
      fill: side === 'right' ? 0xffffff : 0x111111,
      wordWrap: true,
      wordWrapWidth: maxBubbleWidthidth,
      lineHeight: 24,
    },
  });

  // Padding inside bubble
  const padX = 14;
  const padY = 10;

  // Measure text (Pixi calculates width/height after creation)
  const bubbleWidth = Math.ceil(messageText.width + padX * 2);
  const bubbleHeight = Math.ceil(messageText.height + padY * 2);

  // ----- Bubble (rounded rect) -----
  const bubble = new Graphics()
    .roundRect(0, 0, bubbleWidth, bubbleHeight, 16)
    .fill(side === 'right' ? 0x2f7cf6 : 0xe9e9eb);

  // Put text inside bubble
  messageText.x = padX;
  messageText.y = padY;

  const bubbleContainer = new Container();
  bubbleContainer.addChild(bubble);
  bubbleContainer.addChild(messageText);

  // ----- Layout: left vs right -----
  const gap = 10; // space between avatar and bubble

  // By default we layout as "left"
  avatarContainer.x = 0;
  avatarContainer.y = 0;

  bubbleContainer.x = avatarSize + gap;
  bubbleContainer.y = -30;

  // If it's right-side message: avatar on the right, bubble before it
  if (side === 'right') {
    bubbleContainer.x = 0;
    avatarContainer.x = bubbleWidth + gap + 30;
  }

  root.addChild(avatarContainer);
  root.addChild(bubbleContainer);

  // Helpful: store the total size for stacking
  root.width; // triggers internal update
  (root as any).__bubbleHeight = Math.max(avatarSize, bubbleHeight);

  return root;
}
