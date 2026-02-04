export const totalCards = 144;

// Responsive card scale based on screen width
export const getCardScale = () => {
  const baseWidth = 1920;
  const minScale = 1.5;
  const maxScale = 3;
  const scale = (window.innerWidth / baseWidth) * maxScale;
  return Math.max(minScale, Math.min(maxScale, scale));
};

// For backwards compatibility
export const cardScale = 3.5;
