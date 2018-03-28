const {
  getPhraseGroupsFromText,
  getWordsFromPhraseGroups,
  getPhrasesFromWords,
  getPhrasesFromWordsList,
  getPhraseCountsFromPhrases,
  getRepeatedPhrasesFromPhraseCounts,
  getPhrasesWithoutSubphrases,
  getPhrasesSortedByCount,
} = require('./helpers.js');

describe('getPhraseGroupsFromText', () => {
  test('should split text into groups of words based on punctuation', () => {
    const result = getPhraseGroupsFromText('Hello, world. How are you? I am awesome! Hope you are, too.');
    expect(result).toEqual(['Hello', 'world', 'How are you', 'I am awesome', 'Hope you are', 'too']);
  });

  test('should not recognize non-terminal punctuation', () => {
    const result = getPhraseGroupsFromText('I did not know that aol.com was still around.');
    expect(result).toEqual(['I did not know that aol.com was still around']);
  });
});

describe('getWordsFromPhraseGroups', () => {
  test('should break a string into an array of words', () => {
    const result = getWordsFromPhraseGroups('i have the best words');
    expect(result).toEqual(['i', 'have', 'the', 'best', 'words']);
  });

  test('should transform words to lower case', () => {
    const result = getWordsFromPhraseGroups('WHY AM I SHOUTING');
    expect(result).toEqual(['why', 'am', 'i', 'shouting']);
  });
});

describe('getPhrasesFromWords/getPhrasesFromWordsList', () => {
  const mockWords = [
    'i',
    'have',
    'the',
    'best',
    'words',
  ];

  const mockWordsPhrases = [
    'i have the',
    'i have the best',
    'i have the best words',
    'have the best',
    'have the best words',
    'the best words',
  ];

  const otherMockWords = [
    'these',
    'words',
    'are',
    'my',
    'words',
  ];

  const otherMockWordsPhrases = [
    'these words are',
    'these words are my',
    'these words are my words',
    'words are my',
    'words are my words',
    'are my words',
  ];

  test('should construct phrases from an array of phrase groups', () => {
    const result = getPhrasesFromWords(mockWords);
    expect(result).toEqual(mockWordsPhrases);
  });

  test('should not construct phrases that are smaller than the minimum phrase length or larger than the maximum phrase length', () => {
    const result = getPhrasesFromWords(['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
    result.forEach(value => {
      // 3 letters, 2 spaces between = 5
      expect(value.length).toBeGreaterThanOrEqual(5);
      // 10 letters, 9 spaces between = 19
      expect(value.length).toBeLessThanOrEqual(19);
    })
  });

  test('should construct aggregated phrases from an array of arrays of phrase groups', () => {
    const result = getPhrasesFromWordsList([mockWords, otherMockWords]);
    expect(result).toEqual([...mockWordsPhrases, ...otherMockWordsPhrases]);
  });
});

describe('getPhraseCountsFromPhrases', () => {
  test('should construct and object keyed by phrase with the values equal to the number of times the phrase appears in the array', () => {
    const result = getPhraseCountsFromPhrases([
      'the cake is good',
      'the cake is bad',
      'the cake is cake',
      'the cake is a lie',
      'the cake is a lie',
      'the cake is a lie',
      'the cake is bad',
    ]);

    expect(result).toMatchObject({
      'the cake is a lie': 3,
      'the cake is bad': 2,
      'the cake is good': 1,
      'the cake is cake': 1,
    });
  });
});

describe('getRepeatedPhrasesFromPhraseCounts', () => {
  test('should return only phrases that have a count greater than 1', () => {
    const result = getRepeatedPhrasesFromPhraseCounts({
      'there is only one of these': 1,
      'there are two of these': 2,
      'holy cow there are fifty of these': 50,
    });
    expect(result).toEqual([
      'there are two of these',
      'holy cow there are fifty of these',
    ]);
  });
});

describe('getPhrasesWithoutSubphrases', () => {
  test('should return only phrases that are not subphrases of another larger phrase', () => {
    const result = getPhrasesWithoutSubphrases([
      'how much wood could a woodchuck chuck if a woodchuck could chuck wood',
      'bird is the word',
      'woodchuck could chuck',
      'woodchucks are fake news',
      'wood could a woodchuck chuck',
    ]);
    expect(result).toEqual([
      'how much wood could a woodchuck chuck if a woodchuck could chuck wood',
      'bird is the word',
      'woodchucks are fake news',
    ]);
  });
});

describe('getPhrasesSortedByCount', () => {
  test('should return an array of phrases in descending order based on count', () => {
    const phrases = ['what is going on', 'the sky is falling', 'everyone take cover'];
    const phraseCounts = {
      'what is going on': 128,
      'the sky is falling': 14,
      'everyone take cover': 188,
    };
    const result = getPhrasesSortedByCount(phrases, phraseCounts);
    expect(result).toEqual(['everyone take cover', 'what is going on', 'the sky is falling']);
  });

  test('should not return phrases if they are missing from the counts', () => {
    const phrases = ['what is going on', 'the sky is falling', 'everyone take cover'];
    const phraseCounts = {
      'the sky is falling': 14,
      'everyone take cover': 188,
    };
    const result = getPhrasesSortedByCount(phrases, phraseCounts);
    expect(result).toEqual(['everyone take cover', 'the sky is falling']);
  });
});



