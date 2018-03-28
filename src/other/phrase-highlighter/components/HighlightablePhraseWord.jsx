import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import Color from 'color';
import { PHRASE_COLOR_VALUES } from '../phrases';
import {
  getPriorityGroupNumber,
  getWordBorderStates,
} from '../helpers';

const WORD_STYLES = {
  margin: '0 -3px',
  padding: '0 8px',
  position: 'relative',
};

class HighlightablePhraseWord extends Component {
  _handleMouseEnter = () => {
    this.props.onMouseEnter({
      group: this._getPriorityGroupId(),
    });
  }

  _getPriorityGroupId = () => {
    const { groups, groupColorsById } = this.props;
    return getPriorityGroupNumber(groups, groupColorsById);
  }

  _handleMouseLeave = () => {
    this.props.onMouseLeave();
  }

  render() {
    const {
      word,
      groups,
      groupColorsById,
      activePhraseGroupId, // which phrase group id is currently active
      priorityPhraseGroupId, // for the phrase that owns this word, what is the highest priority group id
      previousWord,
      nextWord,
    } = this.props;

    // Words have three 'states' - Accented, Muted, and Neutral
    // --------------------------------------------------------
    // * Accented = The phrase the word belongs to is active and should be accented in the UI
    // * Muted = No group is active so the word should display be muted in the UI
    // * Neutral = A phrase group id is active but this word does not belong to it, display neutral in the UI
    const isAccented = groups.includes(activePhraseGroupId);
    const isMuted = !activePhraseGroupId;
    const isNeutral = !isAccented && activePhraseGroupId;

    // Get the highest priority group id for this word
    const highestPriorityWordGroupId = this._getPriorityGroupId();

    // Map group color ids to actual color values, for neutral we need to use rgba white
    // with full opacity so the our color helper can correctly determine the text contrast
    // color for transparent
    const accentColor = PHRASE_COLOR_VALUES[groupColorsById[activePhraseGroupId]];
    const mutedColor = PHRASE_COLOR_VALUES[groupColorsById[highestPriorityWordGroupId]];
    const neutralColor = 'rgba(255,255,255,0)';

    // Set background and text color based on word state
    let backgroundColor = Color(accentColor);
    if (isAccented) backgroundColor = backgroundColor.darken(0.5);
    if (isMuted) backgroundColor = Color(mutedColor);
    if (isNeutral) backgroundColor = Color(neutralColor);
    const textColor = backgroundColor.isLight() ? 'black' : 'white';

    // Does the word belong to the highest priority group of the containing phrase
    const isWordInPhrasePriorityGroup = groups.includes(priorityPhraseGroupId);

    const wordBorderStates = getWordBorderStates(
      previousWord,
      nextWord,
      activePhraseGroupId,
      priorityPhraseGroupId,
      isAccented,
      groups,
      groupColorsById,
    );

    const {
      showLeftBorderRadius,
      showRightBorderRadius,
      showLeftBorder,
      showRightBorder,
    } = wordBorderStates

    const dynamicWordStyles = {
      ...WORD_STYLES,
      backgroundColor: backgroundColor,
      color: textColor,
      borderLeft: `1px solid ${showLeftBorder ? 'white' : 'transparent'}`,
      borderRight: `1px solid ${showRightBorder ? 'white' : 'transparent'}`,
      borderTopLeftRadius: showLeftBorderRadius && '5px',
      borderBottomLeftRadius: showLeftBorderRadius && '5px',
      borderTopRightRadius: showRightBorderRadius && '5px',
      borderBottomRightRadius: showRightBorderRadius && '5px',
      // Since we're using negative left and right margin for slight visual overlap
      // we need to order neutral words on the bottom, words in priority group above non priority.
      zIndex: isNeutral ? 1 : isWordInPhrasePriorityGroup ? 3 : 2,
    };

    return (
      <span
        style={dynamicWordStyles}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        {word}
      </span>
    );
  }
}

HighlightablePhraseWord.propTypes = {
  activePhraseGroupId: PropTypes.number,
  priorityPhraseGroupId: PropTypes.number,
  word: PropTypes.string,
  nextWord: PropTypes.object,
  previousWord: PropTypes.object,
  groups: PropTypes.array,
  groupCololorsById: PropTypes.object,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
}

export default Radium(HighlightablePhraseWord);

