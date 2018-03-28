const {
  PHRASE_MINIMUM_WORD_COUNT,
  PHRASE_MAXIMUM_WORD_COUNT,
  PHRASE_MINIMUM_FREQUENCY_COUNT,
} = require('./constants.js');

function getPhraseGroupsFromText(text) {
  const phraseGroups = text.split(/[,.!?]\s/);
  const lastIndex = phraseGroups.length - 1;
  phraseGroups[lastIndex] = phraseGroups[lastIndex].replace(/[,.!?]$/, '');
  return phraseGroups;
}

function getWordsFromPhraseGroups(phraseGroups) {
  return phraseGroups.split(' ').map(word => word.toLowerCase());
}

function getPhrasesFromWords(words) {
  return words.reduce((prev, next, index) => {
    const phraseArr = [];

    const startingIndex = PHRASE_MINIMUM_WORD_COUNT + index;
    const endingIndex = Math.min((index + PHRASE_MAXIMUM_WORD_COUNT), words.length);

    for (let i = startingIndex; i <= endingIndex; i++) {
      const phrase = words.slice(index, i).join(' ');
      phraseArr.push(phrase);
    }

    return [...prev, ...phraseArr];
  }, []);
}

function getPhrasesFromWordsList(wordsList) {
  return wordsList.reduce((prev, next) => {
    return [...prev, ...getPhrasesFromWords(next)];
  }, []);
}

function getPhraseCountsFromPhrases(phrases) {
  return phrases.reduce((prev, next) => {
    const previousPhraseCount = prev[next];

    let newPhraseCount;
    if (!previousPhraseCount) {
      newPhraseCount = 1;
    } else {
      newPhraseCount = previousPhraseCount + 1;
    }

    return {...prev, [next]: newPhraseCount}
  }, {});
}

function getPhrasesWithoutSubphrases(phrases) {
  return phrases.reduce((prev, next) => {
    const isSubphrase = phrases.reduce((innerPrev, innerNext) => {
      if (innerPrev) return innerPrev;
      if (next.length >= innerNext.length) return innerPrev;

      return innerNext.includes(next);
    }, false);

    return isSubphrase ? prev : [...prev, next];
  }, []);
}

function getRepeatedPhrasesFromPhraseCounts(phraseCounts) {
  const phrases = Object.keys(phraseCounts);

  return phrases.reduce((prev, next) => {
    if (phraseCounts[next] > PHRASE_MINIMUM_FREQUENCY_COUNT) return [...prev, next];
    return prev;
  }, []);
}

function getPhrasesSortedByCount(phrases, phraseCounts) {
  const sorted = phrases.reduce((prev, next) => {
    if (!phraseCounts[next]) return prev;
    return [...prev, { phrase: next, count: phraseCounts[next] }];
  }, []).sort((a, b) => a.count < b.count);

  return sorted.map(item => item.phrase);
}

module.exports = {
  getPhraseGroupsFromText,
  getWordsFromPhraseGroups,
  getPhrasesFromWords,
  getPhrasesFromWordsList,
  getPhraseCountsFromPhrases,
  getPhrasesWithoutSubphrases,
  getRepeatedPhrasesFromPhraseCounts,
  getPhrasesSortedByCount,
};
