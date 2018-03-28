const { getTopPhrasesFromText } = require('./main.js');

describe('getTopPhrasesFromText', () => {
  test('the text should match the expected output from the challenge', () => {
    const text = 'Well, I do think there\'s blame, yes. I do think there\'s blame on both sides. You look at both sides. I think there\'s blame on both sides and I have no doubt about it and you don\'t have any doubt about it either and, and, and, and if you reported it accurately, you would say it. You have some very bad people in that group, but you also had people that were very fine people on both sides. You had people in that group, excuse me, excuse me, I saw the same pictures as you did. You had people in that group that were there to protest the taking down of, to them, a very, very important statue and the renaming of a park from Robert E Lee to another name.';
    const result = getTopPhrasesFromText(text);
    expect(result).toEqual([
      'i do think there\'s blame',
      'think there\'s blame on both sides',
      'doubt about it',
      'you had people in that group',
    ]);
  });
});
