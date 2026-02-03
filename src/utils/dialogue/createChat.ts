import { Texture, Container, Assets } from 'pixi.js';
import gsap from 'gsap';
import { createChatMessage } from './chatCreator';
import type { AvatarItem, DialogueItem, EmojiItem } from '../types';

const MESSAGE_GAP = 14;
const ANIMATION_DURATION = 0.4;

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

  const chatMessages: Container[] = [];
  // Fixed bottom position where new messages appear
  const bottomY = 300;

  function addChatMessage(msg: DialogueItem) {
    const chatMessage = createChatMessage({
      text: msg.text ?? '',
      side: msg.name === 'Penny' ? 'left' : 'right',
      avatarTexture: avatarTextures[msg.name],
      emojiTextures,
    });

    // Add new message to array first
    chatMessages.push(chatMessage);

    // Recalculate all positions from bottom up
    let currentY = bottomY;
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      const message = chatMessages[i];
      const messageHeight = (message as any).__bubbleHeight ?? 60;

      const targetY = currentY - messageHeight;

      if (message === chatMessage) {
        // New message: animate in from below
        message.x = 0;
        message.y = targetY + 50;
        message.alpha = 0;
        chatList.addChild(message);

        gsap.to(message, {
          y: targetY,
          alpha: 1,
          duration: ANIMATION_DURATION,
          ease: 'power2.out',
        });
      } else {
        // Existing message: animate to new position
        gsap.to(message, {
          y: targetY,
          duration: ANIMATION_DURATION,
          ease: 'power2.out',
        });
      }

      currentY = targetY - MESSAGE_GAP;
    }
  }

  // Add first message
  if (dialogue.length > 0) {
    addChatMessage(dialogue[0]);
  }

  // Add remaining messages over time
  let messageIndex = 1;
  const interval = setInterval(() => {
    if (messageIndex < dialogue.length) {
      addChatMessage(dialogue[messageIndex]);
      messageIndex++;
    } else {
      clearInterval(interval);
    }
  }, 2000);

  // Position chat container
  chatList.x = window.innerWidth / 2 - 150;
  chatList.y = window.innerHeight / 2 - 200;

  // Re-center on resize
  const centerChat = () => {
    chatList.x = window.innerWidth / 2 - 150;
    chatList.y = window.innerHeight / 2 - 200;
  };

  window.addEventListener('resize', centerChat);

  return { chatList };
}
