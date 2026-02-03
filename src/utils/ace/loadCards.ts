import { Assets, Sprite } from 'pixi.js';
import type { Texture } from 'pixi.js';
import { cardScale, totalCards } from './consts';
import gsap from 'gsap';
import type { Container } from 'pixi.js';

// Async function because we need to WAIT for assets and app init
export const loadCards = async (container: Container) => {
  const manifestRes = await fetch('/aces-of-shadows/cards/manifest.json');
  if (!manifestRes.ok) {
    throw new Error(
      `Failed to load card manifest: ${manifestRes.status} ${manifestRes.statusText}`
    );
  }

  const manifest = (await manifestRes.json()) as { files?: unknown };
  const files = Array.isArray(manifest.files)
    ? (manifest.files.filter((f): f is string => typeof f === 'string') as string[])
    : [];
  if (files.length === 0)
    throw new Error(
      'Card manifest has no files. Check `public/aces-of-shadows/cards/manifest.json`.'
    );

  const urls = files.map((f) => `/aces-of-shadows/cards/${f}`);
  const textures = (await Promise.all(urls.map((url) => Assets.load(url)))) as Texture[];

  const cards: Sprite[] = [];

  function shuffleInPlace<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  const deck: Texture[] = [];
  while (deck.length < totalCards) deck.push(...textures);
  deck.length = totalCards;
  shuffleInPlace(deck);

  for (let i = 0; i < totalCards; i++) {
    const card = new Sprite(deck[i]);
    card.anchor.set(0.5);
    card.scale.set(cardScale);
    card.position.set(0, 0);
    card.position.x = i * -0.5;

    cards.push(card);
    // container.addChild(card);
  }

  function moveCards() {
    if (cards.length > 0) {
      const card = cards.pop();
      if (!card) return;

      // bring to front
      container.addChild(card);

      gsap.to(card, {
        duration: 2,
        y: card.y + 200,
        ease: 'power2.inOut',
      });
    }
  }
  // Update tweens every frame
  return { cards, moveCards };
};
