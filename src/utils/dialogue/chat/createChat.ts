import { Texture, Container, Assets } from 'pixi.js';
import { createChatMessage } from './chatCreator';
import type { AvatarItem, DialogueItem, EmojiItem } from '../../types';

export async function createChat(
  dialogue: DialogueItem[],
  avatarItems: AvatarItem[],
  emojiItems: EmojiItem[]
) {
  // Chat container
  const chatList = new Container();

  // Preload all avatar textures with loadParser hint for URLs without extensions
  const avatarTextures: Record<string, Texture> = {};
  for (const avatar of avatarItems) {
    try {
      Assets.add({
        alias: `avatar-${avatar.name}`,
        src: avatar.url,
        loadParser: 'loadTextures',
      });
      avatarTextures[avatar.name] = await Assets.load(`avatar-${avatar.name}`);
    } catch (err) {
      console.warn('Failed to load avatar for', avatar.name, err);
    }
  }

  // Preload all emoji textures
  const emojiTextures: Record<string, Texture> = {};
  for (const emoji of emojiItems) {
    try {
      Assets.add({
        alias: `emoji-${emoji.name}`,
        src: emoji.url,
        loadParser: 'loadTextures',
      });
      emojiTextures[emoji.name] = await Assets.load(`emoji-${emoji.name}`);
    } catch (err) {
      console.warn('Failed to load emoji for', emoji.name, err);
    }
  }

  const sizeOfChatLength = 5;
  let chatY = 0;
  for (let i = 0; i < Math.min(dialogue.length, sizeOfChatLength); i++) {
    const msg = dialogue[i];
    const msgText = msg.text ?? '';
    const side = msg.name === 'Penny' ? 'left' : 'right';
    const avatarTex = avatarTextures[msg.name];

    const chatMessage = createChatMessage({
      text: msgText,
      side,
      avatarTexture: avatarTex,
      emojiTextures,
    });

    chatMessage.x = 0;
    chatMessage.y = chatY;
    chatList.addChild(chatMessage);

    const currentY = (chatMessage as any).__bubbleHeight ?? 60;
    chatY += currentY + 14;
  }

  const bounds = chatList.getBounds();
  chatList.pivot.set(bounds.width / 2, bounds.height / 2);
  chatList.x = window.innerWidth / 2 + 20;
  chatList.y = window.innerHeight / 1.6;

  // Re-center on resize
  const centerChat = () => {
    chatList.x = window.screen.width / 2;
    chatList.y = window.screen.height / 2;
  };

  return { chatList, centerChat };
}
