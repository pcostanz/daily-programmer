import * as React from 'react';
import String from './String';

// const STYLES = {
//   flexDirection: 'column',
//   display: 'flex',
//   alignItems: 'center',
// }

class StringList extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = this._getActiveItemState();
  }

  _handleMouseEvent = (activeIndex) => {
    this.setState(this._getActiveItemState(activeIndex));
  }

  _getActiveItemState = (activeIndex = this.props.defaultActiveIndex) => {
    return { activeIndex };
  }

  render() {
    const {
      stringsData,
      lowestDistanceIndicies,
    } = this.props;
    const {
      activeIndex,
    } = this.state;

    return (
      <div>
        {stringsData.map((stringData, index) =>
          <String
            key={index}
            activeIndex={activeIndex}
            isActive={index === activeIndex}
            stringData={stringData}
            isLowestDistance={lowestDistanceIndicies.includes(index)}
            onMouseEvent={this._handleMouseEvent}
            string={stringData.string}
            aggregateDistance={stringData.aggregateDistance}
            index={index}
          />
        )}
      </div>
    );
  }
}

export default StringList;
