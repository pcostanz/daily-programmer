import * as React from 'react';

const CONTAINER_STYLES = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '-20px',
};

const HIGHLIGHT_STYLES = {
  height: '10px',
  width: '10px',
  borderRadius: '50%',
  margin: '0 10px',
};

class DistanceIndicator extends React.Component {
  render() {
    const {
      distance,
      highlight,
    } = this.props;

    const highlightStyles = {
      ...HIGHLIGHT_STYLES,
      background: highlight ? 'rgb(52, 224, 52)' : 'transparent',
    }

    return (
      <div style={CONTAINER_STYLES}>
        {distance}
        <div style={highlightStyles} />
      </div>
    );
  }
}

export default DistanceIndicator;
