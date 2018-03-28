import * as React from 'react';

class StringWithHighlights extends React.Component {
  render() {
    const {
      isActive,
      string,
      relativeStringProfile,
    } = this.props;

    if (isActive) return <div>{string}</div>;

    const stringNodes = relativeStringProfile.map((profileItem, index) => {
      const color = profileItem ? 'black' : 'lightgray';

      return (
        <span
          key={index}
          style={{ color }}>
          {string.charAt(index)}
        </span>
      );
    });

    return (
      <div>{stringNodes}</div>
    );
  }
}

export default StringWithHighlights;
