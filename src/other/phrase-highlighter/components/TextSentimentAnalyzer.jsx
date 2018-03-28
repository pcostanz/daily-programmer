import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import {
  getMatchingPhraseDetailsFromText,
  getPhraseDetailsWithNestedSubphrases,
  getPhraseDetailsWithAdjoiningText,
} from '../helpers';

import HighlightablePhrase from './HighlightablePhrase';

const TextSentimentAnalyzer = ({ text }) => {
  const phraseDetails = getMatchingPhraseDetailsFromText(text);
  const phraseDetailsWithNestedSubphrases = getPhraseDetailsWithNestedSubphrases(phraseDetails);
  const phraseDetailsWithAdjoiningText = getPhraseDetailsWithAdjoiningText(phraseDetailsWithNestedSubphrases, text);

  return (
    <div>
      {phraseDetailsWithAdjoiningText.map((details, index) => {
        if (!details.phrase) {
          return details.plainText;
        }

        return (
          <HighlightablePhrase
            key={index}
            details={details}
          />
        );
      })}
    </div>
  );
};

TextSentimentAnalyzer.defaultProps = {
  text: '',
};

TextSentimentAnalyzer.propTypes = {
  text: PropTypes.string,
};

export default Radium(TextSentimentAnalyzer);
