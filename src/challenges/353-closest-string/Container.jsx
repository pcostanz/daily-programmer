import * as React from 'react';

import {
  getStringDistanceProfile,
  getAggregateDistanceData,
} from './utils';

import StringList from './StringList';

const items = [
  'CTCCATCACAC',
  'AATATCTACAT',
  'ACATTCTCCAT',
  'CCTCCCCACTC',
];

// const items = [
//   'ACAAAATCCTATCAAAAACTACCATACCAAT',
//   'ACTATACTTCTAATATCATTCATTACACTTT',
//   'TTAACTCCCATTATATATTATTAATTTACCC',
//   'CCAACATACTAAACTTATTTTTTAACTACCA',
//   'TTCTAAACATTACTCCTACACCTACATACCT',
//   'ATCATCAATTACCTAATAATTCCCAATTTAT',
//   'TCCCTAATCATACCATTTTACACTCAAAAAC',
//   'AATTCAAACTTTACACACCCCTCTCATCATC',
//   'CTCCATCTTATCATATAATAAACCAAATTTA',
//   'AAAAATCCATCATTTTTTAATTCCATTCCTT',
//   'CCACTCCAAACACAAAATTATTACAATAACA',
//   'ATATTTACTCACACAAACAATTACCATCACA',
//   'TTCAAATACAAATCTCAAAATCACCTTATTT',
//   'TCCTTTAACAACTTCCCTTATCTATCTATTC',
//   'CATCCATCCCAAAACTCTCACACATAACAAC',
//   'ATTACTTATACAAAATAACTACTCCCCAATA',
//   'TATATTTTAACCACTTACCAAAATCTCTACT',
//   'TCTTTTATATCCATAAATCCAACAACTCCTA',
//   'CTCTCAAACATATATTTCTATAACTCTTATC',
//   'ACAAATAATAAAACATCCATTTCATTCATAA',
//   'CACCACCAAACCTTATAATCCCCAACCACAC',
// ];

class Container extends React.Component {
  render() {
    const {
      lowestAggregateDistanceIndicies,
      stringsData,
    } = getAggregateDistanceData(items);

    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%'}}>
        <StringList
          lowestDistanceIndicies={lowestAggregateDistanceIndicies}
          stringsData={stringsData}
          defaultActiveIndex={lowestAggregateDistanceIndicies[0]}
        />
      </div>
    );
  }
}

export default Container;
