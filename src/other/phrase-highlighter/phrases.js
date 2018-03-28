const RED_PHRASES = [
  'freaking awesome',
  'alarming',
  'candidates',
  'kill',
];

const GREEN_PHRASES = [
  'adorable',
  'most people',
  'love',
  'the famous character',
];

const BLUE_PHRASES = [
  'an adorable puppy',
  'athletic',
  'arm',
  'very unlikely',
];

const PURPLE_PHRASES = [
  'do not cross',
  'say that',
  'our team',
  'a little bit',
];

const GREY_PHRASES = [
  'most people',
  'based on the',
];

const COLOR_PHRASES = {
  red: RED_PHRASES,
  green: GREEN_PHRASES,
  blue: BLUE_PHRASES,
  purple: PURPLE_PHRASES,
  grey: GREY_PHRASES,
};

const PHRASE_COLOR_PRIORITIES = {
  red: 5,
  green: 4,
  blue: 3,
  purple: 2,
  grey: 1,
};

const PHRASE_COLOR_VALUES = {
  red: '#ff8080',
  green: '#adebad',
  blue: '#99c2ff',
  purple: '#ccb3ff',
  grey: '#cccccc',
};

const PHRASE_COLORS = Object.keys(COLOR_PHRASES).reduce((prev, next) => {
  const colors = COLOR_PHRASES[next];

  return colors.reduce((prevColor, nextColor) => {
    return {
      ...prevColor,
      [nextColor]: next,
    };
  }, prev);
}, {});

const PHRASES = Object.keys(PHRASE_COLORS);

module.exports = {
  PHRASE_COLOR_PRIORITIES,
  PHRASE_COLOR_VALUES,
  PHRASE_COLORS,
  PHRASES,
};
