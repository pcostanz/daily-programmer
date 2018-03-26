function getStringDistanceProfile(stringA, stringB) {
  const profile = [];
  let distance = 0;
  for (let i = 0; i < stringA.length; i++) {
    const match = stringA.charAt(i) === stringB.charAt(i);
    if (!match) distance = distance + 1;
    profile.push(match);
  }

  return {
    profile,
    distance,
  };
}

function getAggregateDistanceData(strings) {
  let lowestAggregateDistanceIndicies = [];
  let lowestAggregateDistance = 9999999;

  const stringsData = strings.map((string, index) => {
    const relativeStrings = [];
    let aggregateDistance = 0;

    for (let i = strings.length - 1; i >= 0; i--) {
      const profile = getStringDistanceProfile(string, strings[i]);
      const { distance } = profile;
      relativeStrings.unshift(profile);
      aggregateDistance = aggregateDistance + distance;
    }

    if (aggregateDistance < lowestAggregateDistance) {
      lowestAggregateDistance = aggregateDistance;
      lowestAggregateDistanceIndicies = [index];
    } else if (aggregateDistance === lowestAggregateDistance) {
      lowestAggregateDistanceIndicies.push(index);
    }

    return {
      aggregateDistance,
      relativeStrings,
      string,
    };
  });

  return {
    lowestAggregateDistanceIndicies,
    stringsData,
  };
}

export {
  getStringDistanceProfile,
  getAggregateDistanceData,
};
