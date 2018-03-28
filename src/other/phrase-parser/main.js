const {
  PHRASE_MAXIMUM_OUTPUT_COUNT,
} = require('./constants.js');

const {
  getPhraseGroupsFromText,
  getWordsFromPhraseGroups,
  getPhrasesFromWordsList,
  getPhraseCountsFromPhrases,
  getPhrasesWithoutSubphrases,
  getRepeatedPhrasesFromPhraseCounts,
  getPhrasesSortedByCount,
} = require('./helpers.js');

function getTopPhrasesFromText(text, phraseCount = PHRASE_MAXIMUM_OUTPUT_COUNT) {
  const phraseGroups = getPhraseGroupsFromText(text);
  const phraseGroupsWords = phraseGroups.map(getWordsFromPhraseGroups);
  const phrases = getPhrasesFromWordsList(phraseGroupsWords);

  const phraseCounts = getPhraseCountsFromPhrases(phrases);
  const repeatedPhrases = getRepeatedPhrasesFromPhraseCounts(phraseCounts);
  const phrasesWithoutSubphrases = getPhrasesWithoutSubphrases(repeatedPhrases);
  const phrasesSortedByCount = getPhrasesSortedByCount(phrasesWithoutSubphrases, phraseCounts);

  return phrasesSortedByCount.slice(0, phraseCount - 1);
}

module.exports = {
  getTopPhrasesFromText,
};
