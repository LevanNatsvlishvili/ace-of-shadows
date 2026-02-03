import renderer from './utils/renderer';
import iphoneLoader from './utils/dialogue/iphoneLoader';
import { createChat } from './utils/dialogue/chat/createChat';
import fetchData from './utils/dialogue/chat/fetchData';

export async function init() {
  const { app } = await renderer();

  // Add iPhone background
  const iphone = await iphoneLoader();
  app.stage.addChild(iphone);

  const { dialogue, avatars, emojis } = await fetchData();

  const { chatList, centerChat } = await createChat(dialogue, avatars, emojis);
  app.stage.addChild(chatList);

  app.renderer.on('resize', centerChat);
}

init();
