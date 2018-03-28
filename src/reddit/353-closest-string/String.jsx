import * as React from 'react';

import DistanceIndicator from './DistanceIndicator';
import StringWithHighlights from './StringWithHighlights';

const CONTAINER_STYLES = {
  display: 'grid',
  gridTemplateColumns: '100px auto 100px',
  gridTemplateRows: 'auto',
  cursor: 'default',
};

const STRING_CONTAINER_STYLES = {
  fontSize: '32px',
  letterSpacing: '12px',
  borderRadius: '5px',
  paddingLeft: '10px',
  // letterSpacing applies the spacing to the last letter
  // so we need to offset our padding by the letter spacing
  paddingRight: '-2px',
};

class String extends React.Component {

  _handleMouseEnter = () => {
    this.props.onMouseEvent(this.props.index);
  }

  render() {
    const {
      activeIndex,
      aggregateDistance,
      isActive,
      isLowestDistance,
      stringData,
    } = this.props;

    const activeBorderColor = 'black';
    const inactiveBorderColor = 'transparent';
    const borderColor = isActive ? activeBorderColor : inactiveBorderColor;

    const borderStyles = { border: `2px solid ${borderColor}`};

    const stringContainerStyles = {
      ...STRING_CONTAINER_STYLES,
      ...borderStyles,
    };

    const {
      string,
      relativeStrings,
    } = stringData;

    const {
      distance: relativeStringDistance,
      profile: relativeStringProfile,
    } = relativeStrings[activeIndex];

    return (
      <div
        style={CONTAINER_STYLES}
        onMouseEnter={this._handleMouseEnter}
      >
        <DistanceIndicator
          highlight={isLowestDistance}
          distance={aggregateDistance}
        />
        <div style={stringContainerStyles}>
          <StringWithHighlights
            isActive={isActive}
            relativeStringProfile={relativeStringProfile}
            string={string}
          />
        </div>
        <DistanceIndicator
          distance={relativeStringDistance}
        />
      </div>
    );
  }
}

export default String;
