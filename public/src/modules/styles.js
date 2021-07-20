const THEME_COLORS = {
  BRAND: '#0AAA5A',
  BLUE: '#096CBE',
  ORANGE: '#F15A24',
  BLACK: '#111111',
  GREY: '#7F91A2'
};

const initializeColors = () => {
  if (window.cApplicationLocal) {
    THEME_COLORS.BRAND = window.cApplicationLocal.sectionColor;
  }
};

initializeColors();

export { THEME_COLORS };

export const MAX_WIDTH = 1274;
