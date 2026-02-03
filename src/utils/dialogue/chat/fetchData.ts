import type { AvatarItem, DialogueItem, EmojiItem } from '../../types';

const fetchData = async () => {
  let dialogue: DialogueItem[] = [];
  let avatars: AvatarItem[] = [];
  let emojis: EmojiItem[] = [];
  try {
    const res = await fetch(
      'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords'
    );
    const dataJson = await res.json();
    console.log(dataJson);
    dialogue = dataJson?.dialogue ?? [];
    avatars = dataJson?.avatars ?? [];
    emojis = dataJson?.emojies ?? [];
  } catch (err) {
    console.error('Failed to fetch dialogue:', err);
  }
  return { dialogue, avatars, emojis };
};

export default fetchData;
