import { Container, Graphics, Sprite, Text, Texture } from 'pixi.js';

type Side = 'left' | 'right';

type ChatMessageOptions = {
  text: string;
  side?: Side; // left = incoming, right = outgoing
  maxBubbleWidthidth?: number; // wrap width
  avatarTexture?: Texture; // optional: provide an avatar image
  avatarSize?: number;
  emojiTextures?: Record<string, Texture>; // emoji name -> texture
};

export function createChatMessage({
  text,
  side = 'left',
  maxBubbleWidthidth = 260,
  avatarTexture,
  avatarSize = 44,
  emojiTextures = {},
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

    avatar.anchor.set(0.5);
    avatar.width = avatarSize;
    avatar.height = avatarSize;

    // Mask to make it circular
    const mask = new Graphics().circle(0, 0, avatarSize / 2).fill(0xffffff);
    avatar.mask = mask;

    avatarContainer.addChild(avatar);
    avatarContainer.addChild(mask);
  }

  // ----- Text with inline emojis -----
  const textColor = side === 'right' ? 0xffffff : 0x111111;
  const messageContent = renderTextWithEmojis(text, emojiTextures, textColor, maxBubbleWidthidth);

  // Padding inside bubble
  const padX = 14;
  const padY = 10;

  // Measure content bounds
  const contentBounds = messageContent.getBounds();
  const bubbleWidth = Math.ceil(contentBounds.width + padX * 2);
  const bubbleHeight = Math.ceil(contentBounds.height + padY * 2);

  // ----- Bubble (rounded rect) -----
  const bubble = new Graphics()
    .roundRect(0, 0, bubbleWidth, bubbleHeight, 16)
    .fill(side === 'right' ? 0x2f7cf6 : 0xe9e9eb);

  // Put content inside bubble
  messageContent.x = padX;
  messageContent.y = padY;

  const bubbleContainer = new Container();
  bubbleContainer.addChild(bubble);
  bubbleContainer.addChild(messageContent);

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

function renderTextWithEmojis(
  text: string,
  emojiMap: Record<string, Texture> = {},
  textColor: number,
  maxWidth: number
) {
  const container = new Container();
  // Split text keeping the {emoji} delimiters
  const parts = text.split(/(\{[a-zA-Z0-9_]+\})/g);

  let x = 0;
  let y = 0;
  const lineHeight = 24;
  const emojiSize = 20;

  for (const part of parts) {
    if (!part) continue;

    // Check if this part is an emoji placeholder like {sad}
    const emojiMatch = part.match(/^\{([a-zA-Z0-9_]+)\}$/);

    if (emojiMatch) {
      const emojiName = emojiMatch[1];
      const emojiTex = emojiMap[emojiName];

      if (emojiTex) {
        // Wrap to next line if needed
        if (x + emojiSize > maxWidth && x > 0) {
          x = 0;
          y += lineHeight;
        }

        const emoji = new Sprite(emojiTex);
        emoji.width = emojiSize;
        emoji.height = emojiSize;
        emoji.x = x;
        emoji.y = y + 2; // slight offset to align with text

        container.addChild(emoji);
        x += emojiSize + 4;
      }
    } else {
      // Regular text - split by spaces for word wrapping
      const words = part.split(/(\s+)/);

      for (const word of words) {
        if (!word) continue;

        const wordText = new Text({
          text: word,
          style: { fontSize: 18, fill: textColor },
        });

        // Wrap to next line if needed
        if (x + wordText.width > maxWidth && x > 0) {
          x = 0;
          y += lineHeight;
        }

        wordText.x = x;
        wordText.y = y;
        container.addChild(wordText);
        x += wordText.width;
      }
    }
  }

  return container;
}
