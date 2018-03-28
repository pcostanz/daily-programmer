import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import {
  getWordsArrayFromDetails,
  getGroupColorsFromDetails,
  getPriorityGroupNumber,
} from '../helpers';

import HighlightablePhraseWord from './HighlightablePhraseWord';

const STYLES = {
  display: 'inline-block',
};

class HighlightablePhrase extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      activePhraseGroupId: null,
    };
  }

  _handleWordMouseEnter = ({ group }) => {
    this.setState({
      activePhraseGroupId: group,
    });
  }

  _handleWordMouseLeave = () => {
    this.setState({
      activePhraseGroupId: null,
    });
  }

  render() {
    const { details } = this.props;
    const { activePhraseGroupId } = this.state;

    const wordsArray = getWordsArrayFromDetails(details);
    const groupColorsById = getGroupColorsFromDetails(details);
    const groups = Object.keys(groupColorsById);
    const priorityPhraseGroupId = getPriorityGroupNumber(groups, groupColorsById);

    return (
      <div style={STYLES}>
        {wordsArray.map((word, index) => {
          const previousWord = wordsArray[index - 1];
          const nextWord = wordsArray[index + 1];

          return (
            <HighlightablePhraseWord
              previousWord={previousWord}
              nextWord={nextWord}
              activePhraseGroupId={activePhraseGroupId}
              priorityPhraseGroupId={priorityPhraseGroupId}
              key={index}
              groups={word.groups}
              word={word.word}
              groupColorsById={groupColorsById}
              onMouseEnter={this._handleWordMouseEnter}
              onMouseLeave={this._handleWordMouseLeave}
            />
          );
        })}
      </div>
    );
  }
}

HighlightablePhrase.propTypes = {
  details: PropTypes.shape({
    color: PropTypes.string,
    phrase: PropTypes.string,
    subphraseOverlap: PropTypes.number,
    subphrase: PropTypes.shape({
      color: PropTypes.string,
      phrase: PropTypes.string,
    }),
  }),
};

export default Radium(HighlightablePhrase);
