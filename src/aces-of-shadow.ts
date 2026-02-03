import renderer from './utils/renderer';
import { loadCards } from './utils/ace/loadCards';
import tableLoader from './utils/ace/tableLoader';

export async function init() {
  const { container } = await renderer();
  const { cards, moveCards } = await loadCards(container);
  const table = await tableLoader();
  container.addChildAt(table, 0);
  cards.forEach((card) => {
    container.addChild(card);
  });

  moveCards();
  setInterval(moveCards, 1000);
}
