import renderer from './utils/renderer';
import { createChat } from './utils/dialogue/createChat';
import fetchData from './utils/dialogue/fetchData';

export async function init() {
  const { app } = await renderer();

  const { dialogue, avatars, emojis } = await fetchData();

  const { chatList } = await createChat(dialogue, avatars, emojis);
  app.stage.addChild(chatList);
}
