const average = function(set) {
    return set.reduce((a, b) => a + b) / set.length;
};

const standardDeviation = function(set) {
    let av, totalDeviation;
    av = average(set);
    totalDeviation = 0;
    for (let item of set) {
        let thisDeviation = av - item;
        totalDeviation += thisDeviation * thisDeviation;
    }
    return Math.sqrt(totalDeviation / set.length);
};

export default {
    average,
    standardDeviation
}