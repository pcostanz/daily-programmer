import {
  PHRASE_COLOR_PRIORITIES,
  PHRASE_COLORS,
} from './phrases.js';

function getMatchingPhraseDetailsFromText(text, phraseColors = PHRASE_COLORS) {
  const phraseDetails = Object.keys(phraseColors).reduce((prev, next) => {
    const lowerCaseText = text.toLowerCase();

    // This regex needs to be smarter, right now it isn't considering spaces
    // between words. If it matches on " word." or something that will help.
    const matcher = new RegExp(`\\b${next.toLowerCase()}\\b`, 'g');

    let match;
    let phrases = [];

    // Global regex matches are weird. Instead of returning maybe an array of the matches,
    // you have to repeatedly call exec on the string until it's all out of matches.
    while (match = matcher.exec(lowerCaseText)) { // eslint-disable-line no-cond-assign
      // the match array returned by String.match is a very weird array where the 0 index
      // is the phrase itself, and then the other details are actually indexed by a string
      // value, in the case of the index, that is the string 'index'.
      const { 0: phrase, index } = match;

      const startIndex = index;
      const endIndex = phrase.length + index;

      // Since we're running the matcher against a lowercase text string,
      // and the phrase keys can be any case that may not match the actual
      // text, we need to actually go back and get the original phrase.
      const originalPhrase = text.slice(startIndex, endIndex);

      const phraseDetails = {
        phrase: originalPhrase,
        color: phraseColors[next],
        startIndex,
        endIndex,
      };

      phrases.push(phraseDetails);
    }

    return [...prev, ...phrases];
  }, []);

  phraseDetails.sort((a, b) => a.startIndex - b.startIndex);

  return phraseDetails;
}

function getPhraseDetailsWithNestedSubphrases(phraseDetails) {
  return phraseDetails.reduce((prev, next, index) => {
    // Look back at the last phrase we dealt with, if it had a subphrase
    // then that would mean that we are currently looking at that subphrase
    // and can just return the prev aggregator and move on.
    const previousPhrase = phraseDetails[index - 1];
    if (previousPhrase && previousPhrase.subphrase) {
      return prev;
    }

    // Look ahead to the next phrase, if the startIndex is less than
    // the current phrase's endIndex that means we're dealing with
    // an overlapping phrase and need to augment the data on the object
    // to indicate that there is a subphrase
    const nextPhrase = phraseDetails[index + 1];
    if (nextPhrase && nextPhrase.startIndex < next.endIndex) {
      // @TODO: Clean this up, also I think I'm calculating if the
      // subphrase is nested somewhere else further down the chain so
      // i could remove it there
      next.subphrase = nextPhrase;
      next.subphraseOverlap = next.endIndex - nextPhrase.startIndex;
      next.subphraseIsNested = nextPhrase.phrase.length <= next.subphraseOverlap;
      next.endIndex = next.subphraseIsNested ? next.endIndex: nextPhrase.endIndex;
    }

    return [...prev, next];
  }, []);
}

function getPhraseDetailsWithAdjoiningText(phraseDetails, text) {
  // If we haven't found any phrases yet, we're just dealing with plain
  // text and can return it exactly as it is.
  if (!phraseDetails.length) return [{ plainText: text }];

  return phraseDetails.reduce((prev, next, index) => {
    const newItems = [];

    // If we're analyzing the first phrase, we need to figure out if there
    // is any plain text before the phrase and aggregate it.
    if (index === 0) {
      if (next.startIndex > index) {
        newItems.push({
          plainText: text.slice(0, next.startIndex)
        });
      }
    }

    // Push our phrase into the list.
    newItems.push(next);

    // Now we need to check to see if the content after the phrase spans
    // to the end of the text or to the beginning of the next phrase.
    const isLastIndex = index === phraseDetails.length - 1;
    const endSliceIndex = isLastIndex
      ? text.length
      : phraseDetails[index + 1].startIndex;

    // If the endIndex of the phrase buts up to the end of the text,
    // we don't need to push any adjoining plainText into the array.
    if (next.endIndex !== text.length) {
      newItems.push({
        plainText: text.slice(next.endIndex, endSliceIndex),
      });
    }

    return [...prev, ...newItems];
  }, []);
}

// If we needed to support more than two layers of nesting, modifications
// would need to be made to this method to support chunking out more than
// two groups, this is some complex recursion that I'm going to defer on
// for this prototype.
function getWordsArrayFromDetails(details) {
  const {
    phrase,
    subphrase,
    subphraseOverlap,
  } = details;

  const phraseWords = phrase.split(' ');
  const phraseWordsWithGroups = phraseWords.map(word => ({ word, groups: [1] }));

  if (!subphrase) {
    return phraseWordsWithGroups;
  }

  const subphrasePhrase = subphrase.phrase;
  const subphraseWords = subphrasePhrase.split(' ');

  // If the phrase is entirely nested, we don't need to add any more words to the list,
  // we just need to push the new group id to the subphrase words and return.
  const isNested = subphrasePhrase.length <= subphraseOverlap;

  if (isNested) {
    const nestedWordCount = subphraseWords.length;

    for (let i = 0; i < nestedWordCount; i++) {
      const wordIndex = phraseWords.indexOf(subphraseWords[i]);
      phraseWordsWithGroups[wordIndex].groups.push(2);
    }

    return phraseWordsWithGroups;
  }

  // If the phrase is not nested, we need to determine how many words overlap,
  // and push the new group id into each one and then slice off overlapping words
  // from the subphrase word list, and then append the new group words before
  // merging with the original list.
  const overlap = phrase.slice(phrase.length - subphraseOverlap, phrase.length);
  const overlapWordCount = overlap.split(' ').length;

  for (let i = 1; i <= overlapWordCount; i++ ) {
    const overlapWordIndex = phraseWords.length - i;
    phraseWordsWithGroups[overlapWordIndex].groups.push(2);
  }

  const subphraseWordsWithoutOverlapWords = subphraseWords.slice(overlapWordCount);
  const subphraseWordsWithGroups = subphraseWordsWithoutOverlapWords.map(word => ({ word, groups: [2] }));

  return [...phraseWordsWithGroups, ...subphraseWordsWithGroups];
}

function getGroupColorsFromDetails(details) {
  const {
    color,
    subphrase,
  } = details;

  const groupColors = {
    1: color,
  };

  if (subphrase) {
    groupColors[2] = subphrase.color;
  }

  return groupColors;
}

function getPriorityGroupNumber(groups, groupColors) {
  const groupPriorities = groups.map(group => {
    const groupColor = groupColors[group];

    return {
      group,
      priority: PHRASE_COLOR_PRIORITIES[groupColor],
    };
  });

  groupPriorities.sort((a, b) => a.priority < b.priority);

  return parseInt(groupPriorities[0].group, 10);
}

function getWordBorderStates(previousWord, nextWord, activePhraseGroupId, priorityPhraseGroupId, isAccented, groups, groupColorsById) {
  const isFirstWord = !previousWord;
  const isLastWord = !nextWord;

  const previousWordGroups = (previousWord && previousWord.groups) || [];
  const nextWordGroups = (nextWord && nextWord.groups) || [];

  // Get the priority group number for the previous and next words
  const previousWordPriorityGroup = previousWord && getPriorityGroupNumber(previousWordGroups, groupColorsById);
  const nextWordPriorityGroup = nextWord && getPriorityGroupNumber(nextWordGroups, groupColorsById);

  // Are the previous and next words boundaries to another phrase
  const isPreviousWordAPhraseBoundary = previousWordGroups.length !== groups.length;
  const isNextWordAPhraseBoundary = nextWordGroups.length !== groups.length;

  // Does this word have the same priority group as the previous and next word
  const samePreviousWordPriorityGroup = previousWordPriorityGroup === priorityPhraseGroupId;
  const sameNextWordPriorityGroup = nextWordPriorityGroup === priorityPhraseGroupId;

  // Are the previous and next word currently accented
  const previousWordIsAccented = previousWordGroups.includes(activePhraseGroupId);
  const nextWordIsAccented = nextWordGroups.includes(activePhraseGroupId);

  // Does the word belong to the highest priority group of the containing phrase
  const isWordInPhrasePriorityGroup = groups.includes(priorityPhraseGroupId);

  // In order to achieve the border radius and white outline for phrases on adjacent
  // nodes in the dom, we have to do some fairly complex logic to determine when to
  // show and not show left/right borders and corresponding border radius.
  const nonAccentedShowLeftBorderRadius = ((isPreviousWordAPhraseBoundary && isWordInPhrasePriorityGroup) || isFirstWord) && !samePreviousWordPriorityGroup;
  const nonAccentedShowRightBorderRadius = ((isNextWordAPhraseBoundary && isWordInPhrasePriorityGroup) || isLastWord) && !nextWordIsAccented;

  const accentedShowLeftBorderRadius = (isPreviousWordAPhraseBoundary || isFirstWord) && !previousWordIsAccented;
  const accentedShowRightBorderRadius = (isNextWordAPhraseBoundary || isLastWord) && !nextWordIsAccented;

  const showLeftBorderRadius = isAccented ? accentedShowLeftBorderRadius : nonAccentedShowLeftBorderRadius;
  const showRightBorderRadius = isAccented ? accentedShowRightBorderRadius : nonAccentedShowRightBorderRadius;

  const showLeftBorder = (isPreviousWordAPhraseBoundary && isWordInPhrasePriorityGroup) && !samePreviousWordPriorityGroup && !isAccented;
  const showRightBorder = (isNextWordAPhraseBoundary && isWordInPhrasePriorityGroup) && !sameNextWordPriorityGroup && !isAccented;

  return {
    showLeftBorderRadius,
    showRightBorderRadius,
    showLeftBorder,
    showRightBorder,
  };
}


export {
  getMatchingPhraseDetailsFromText,
  getPhraseDetailsWithNestedSubphrases,
  getPhraseDetailsWithAdjoiningText,
  getWordsArrayFromDetails,
  getGroupColorsFromDetails,
  getPriorityGroupNumber,
  getWordBorderStates,
};
