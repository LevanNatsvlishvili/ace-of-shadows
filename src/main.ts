import renderer from './utils/renderer';
import { loadCards } from './utils/ace/loadCards';
import tableLoader from './utils/ace/tableLoader';

// Async function because we need to WAIT for assets and app init
(async () => {
  const { container, app } = await renderer();
  const { cards, moveCards } = await loadCards(container);
  const table = await tableLoader();
  container.addChildAt(table, 0);
  cards.forEach((card) => {
    container.addChild(card);
  });
  // Update tweens every frame
  app.ticker.add(() => {
    // bunny.rotation += 0.01;
  });
  moveCards();
  setInterval(moveCards, 1000);
})();
