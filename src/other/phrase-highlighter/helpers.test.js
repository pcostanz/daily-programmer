const {
  getMatchingPhraseDetailsFromText,
  getPhraseDetailsWithNestedSubphrases,
  getPhraseDetailsWithAdjoiningText,
  getWordsArrayFromDetails,
  getGroupColorsFromDetails,
  getPriorityGroupNumber,
} = require('./helpers.js');

describe('getMatchingPhraseDetailsFromText', () => {
  const exampleText = 'Hello world, my name is Pat';
  const examplePhraseColors = {
    'Hello world': 'green',
    'my name is Pat': 'orange',
  };

  it('should return an array of matches containing phrase, color, and relevant indexes', () => {
    const result = getMatchingPhraseDetailsFromText(exampleText, examplePhraseColors);
    expect(result).toEqual([{
      phrase: 'Hello world',
      color: 'green',
      startIndex: 0,
      endIndex: 11,
    }, {
      phrase: 'my name is Pat',
      color: 'orange',
      startIndex: 13,
      endIndex: 27,
    }]);
  });

  it('should not care about casing when matching, but return phrases intact as they were in the text', () => {
    const result = getMatchingPhraseDetailsFromText('Hello world', { 'hello world': 'salmon' });
    expect(result).toEqual([{
      phrase: 'Hello world',
      color: 'salmon',
      startIndex: 0,
      endIndex: 11,
    }]);
  });

  it('should not identify words that are not separated by word boundary', () => {
    const result = getMatchingPhraseDetailsFromText('testtest', { 'test': 'salmon' });
    expect(result).toEqual([]);
  });

  it('should be able to identify matching phrases when used multiple times in the text', () => {
    const result = getMatchingPhraseDetailsFromText('test test', { 'test': 'salmon' });
    expect(result).toEqual([{
      phrase: 'test',
      color: 'salmon',
      startIndex: 0,
      endIndex: 4,
    }, {
      phrase: 'test',
      color: 'salmon',
      startIndex: 5,
      endIndex: 9,
    }]);
  });

  it('should return the list sorted by startIndex regardless of order of phrase colors', () => {
    const result = getMatchingPhraseDetailsFromText('hello world', { 'world': 'salmon', 'hello': 'blue' });
    expect(result[0].startIndex).toBeLessThan(result[1].startIndex);
  });
});

describe('getPhraseDetailsWithNestedSubphrases', () => {
  describe('non-overlapping phrase details', () => {
    const nonOverlappignPhraseDetails = [{
      phrase: 'i really enjoy',
      color: 'green',
      startIndex: 0,
      endIndex: 11,
    }, {
      phrase: 'swedish fish',
      color: 'red',
      startIndex: 18,
      endIndex: 32,
    }];

    it('should not change non-overlapping phraseDetail items', () => {
      const result = getPhraseDetailsWithNestedSubphrases(nonOverlappignPhraseDetails);
      expect(result).toEqual(nonOverlappignPhraseDetails);
    });
  });

  describe('overlapping phrase details', () => {
    const overlappingPhraseDetails = [{
      phrase: 'Hello world',
      color: 'green',
      startIndex: 0,
      endIndex: 11,
    }, {
      phrase: 'world wrestling federation',
      color: 'red',
      startIndex: 6,
      endIndex: 32,
    }];

    it('should not set the subphraseIsNested flag', () => {
      const result = getPhraseDetailsWithNestedSubphrases(overlappingPhraseDetails);
      expect(result[0].subphraseIsNested).toBe(false);
    });

    it('should adjust endIndex of parent phrase detail to match subphrase', () => {
      const result = getPhraseDetailsWithNestedSubphrases(overlappingPhraseDetails);
      expect(result[0].endIndex).toBe(32);
    });

    it('should nest subphrase in parent phrase under subphrase key', () => {
      const result = getPhraseDetailsWithNestedSubphrases(overlappingPhraseDetails);
      expect(result[0].subphrase).toEqual({
        phrase: 'world wrestling federation',
        color: 'red',
        startIndex: 6,
        endIndex: 32,
      });
    });

    it('should set the subphrase overlap amount', () => {
      const result = getPhraseDetailsWithNestedSubphrases(overlappingPhraseDetails);
      expect(result[0].subphraseOverlap).toEqual(26);
    });

    it('should not include the subphrase in the top level list', () => {
      const result = getPhraseDetailsWithNestedSubphrases(overlappingPhraseDetails);
      expect(result.length).toEqual(1);
    });
  });

  describe('overlapping phrase details that are nested', () => {
    const nestedOverlappingPhraseDetails = [{
      phrase: 'Hello my friend',
      color: 'green',
      startIndex: 0,
      endIndex: 11,
    }, {
      phrase: 'my',
      color: 'red',
      startIndex: 6,
      endIndex: 7,
    }];

    it('should set the subphraseIsNested flag', () => {
      const result = getPhraseDetailsWithNestedSubphrases(nestedOverlappingPhraseDetails);
      expect(result[0].subphraseIsNested).toEqual(true);
    });

    it('should not adjust the endIndex of the parent phrase detail', () => {
      const result = getPhraseDetailsWithNestedSubphrases(nestedOverlappingPhraseDetails);
      expect(result[0].endIndex).toEqual(11);
    });

    it('should not include the subphrase in the top level list', () => {
      const result = getPhraseDetailsWithNestedSubphrases(nestedOverlappingPhraseDetails);
      expect(result.length).toEqual(1);
    });
  });
});

describe('getPhraseDetailsWithAdjoiningText', () => {
  describe('when no phrases have been aggregated yet', () => {
    it('should return only plainText', () => {
      const result = getPhraseDetailsWithAdjoiningText([], 'what it do');
      expect(result).toEqual([{
        plainText: 'what it do',
      }]);
    });
  });

  describe('when a phrase is not the last thing in the text', () => {
    const text = 'One two three';
    const phraseDetails = [{
      phrase: 'two',
      color: 'schmreen',
      startIndex: 4,
      endIndex: 7,
    }];

    it('should output an item for each chunk of text', () => {
      const result = getPhraseDetailsWithAdjoiningText(phraseDetails, text);
      expect(result.length).toEqual(3);
    });

    it('should correctly chunk out the before plainText, phrase, and after plainText items', () => {
      const result = getPhraseDetailsWithAdjoiningText(phraseDetails, text);
      expect(result[0]).toEqual({ plainText: 'One ' });
      expect(result[1]).toEqual(phraseDetails[0]);
      expect(result[2]).toEqual({ plainText: ' three' });
    });
  });

  describe('when a phrase is the last thing in the text', () => {
    const text = 'One two three';
    const phraseDetails = [{
      phrase: 'three',
      color: 'schmrown',
      startIndex: 8,
      endIndex: 13,
    }];

    it('should output an item for each chunk of text', () => {
      const result = getPhraseDetailsWithAdjoiningText(phraseDetails, text);
      expect(result.length).toEqual(2);
    });

    it('should correctly chunk out the before plainText and phrase', () => {
      const result = getPhraseDetailsWithAdjoiningText(phraseDetails, text);
      expect(result[0]).toEqual({ plainText: 'One two ' });
      expect(result[1]).toEqual(phraseDetails[0]);
    })
  });
});

describe('getWordsArrayFromDetails', () => {
  describe('when a phrase does not have a subphrase', () => {
    const details = {
      color: 'grape',
      phrase: 'grapes are cool',
    };

    it('should break out words into an array with a single group', () => {
      const result = getWordsArrayFromDetails(details);
      expect(result).toEqual([{
        word: 'grapes',
        groups: [1],
      }, {
        word: 'are',
        groups: [1],
      }, {
        word: 'cool',
        groups: [1],
      }]);
    });
  });

  describe('when a phrase has a subphrase that is entirely nested', () => {
    const details = {
      color: 'grape',
      phrase: 'grapes are cool',
      subphraseOverlap: 5,
      subphrase: {
        color: 'banana',
        phrase: 'are',
      },
    };

    it('should break out words into an array with groups corresponding to the phrase', () => {
      const result = getWordsArrayFromDetails(details);
      expect(result).toEqual([{
        word: 'grapes',
        groups: [1],
      }, {
        word: 'are',
        groups: [1, 2],
      }, {
        word: 'cool',
        groups: [1],
      }]);
    });
  });

  describe('when a phrase has a subphrase overlapping', () => {
    const details = {
      color: 'grape',
      phrase: 'grapes are cool',
      subphraseOverlap: 4,
      subphrase: {
        color: 'banana',
        phrase: 'cool dude',
      },
    };

    it('should break out words into an array with groups corresponding to the phrase', () => {
      const result = getWordsArrayFromDetails(details);
      expect(result).toEqual([{
        word: 'grapes',
        groups: [1],
      }, {
        word: 'are',
        groups: [1],
      }, {
        word: 'cool',
        groups: [1, 2],
      }, {
        word: 'dude',
        groups: [2]
      }]);
    });
  });
});

describe('getGroupColorsFromDetails', () => {
  describe('when a phrase does not have a subphrase', () => {
    const details = {
      color: 'grape',
      phrase: 'grapes are cool',
    };

    it('should return color values keyed by group id', () => {
      const result = getGroupColorsFromDetails(details);
      expect(result).toEqual({
        1: 'grape',
      });
    });
  });

  describe('when a phrase has a subphrase', () => {
    const details = {
      color: 'grape',
      phrase: 'grapes are cool',
      subphraseOverlap: 4,
      subphrase: {
        color: 'banana',
        phrase: 'cool dude',
      },
    };

    it('should return color values keyed by group id', () => {
      const result = getGroupColorsFromDetails(details);
      expect(result).toEqual({
        1: 'grape',
        2: 'banana',
      });
    });
  });
});

describe('getPriorityGroupNumber', () => {
  const groups = [1, 2, 3, 4, 5];
  const groupColors = {
    1: 'purple',
    2: 'grey',
    3: 'red',
    4: 'blue',
    5: 'green',
  };

  it('should return the highest priority group number', () => {
    const result = getPriorityGroupNumber(groups, groupColors);
    expect(result).toEqual(3);
  });
});
