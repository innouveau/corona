import store from '@/store/store';
import calculate from '@/tools/calculate';

class Day {
    constructor(entry, country) {
        this.index = entry.index;
        this.country = country;
        this.cases = entry.cases;
        this.fatalities = entry.fatalities;
        this.date = entry.date;
    }

    get previous() {
        if (this.index > 0) {
            return this.country.originalDataPoints[this.index - 1];
        } else {
            return null;
        }
    }

    get delta_cases() {
        if (this.previous) {
            return this.cases - this.previous.cases;
        } else {
            return this.cases;
        }
    }

    get delta_fatalities() {
        if (this.previous) {
            return this.fatalities - this.previous.fatalities;
        } else {
            return this.fatalities;
        }
    }

    get rawGrowthFatalities() {
        if (!this.previous || this.previous.delta_fatalities === 0) {
            // ??
            return 5;
        } else {
            return this.delta_fatalities / this.previous.delta_fatalities;
        }
    }

    get rawGrowthCases() {
        if (!this.previous || this.previous.delta_cases === 0) {
            // ??
            return 5;
        } else {
            return this.delta_cases / this.previous.delta_cases;
        }
    }



    get standardDeviationForFatalities() {
        let thisIndex, desiredLength, startingIndex, endIndex, set;
        desiredLength = 4;
        thisIndex = this.index;
        set = [];
        startingIndex = Math.max(thisIndex - desiredLength, 0);
        endIndex = Math.min(thisIndex + desiredLength, (this.country.originalDataPoints.length - 1));
        for (let i = startingIndex; i < (endIndex + 1); i++) {
            let day = this.country.originalDataPoints[i];
            set.push(day.rawGrowthFatalities);
        }
        return {
            n: set.length,
            standardDeviation: calculate.standardDeviation(set)
        };
    }

    get standardDeviationForCases() {
        let thisIndex, desiredLength, startingIndex, endIndex, set;
        desiredLength = 4;
        thisIndex = this.index;
        set = [];
        startingIndex = Math.max(thisIndex - desiredLength, 0);
        endIndex = Math.min(thisIndex + desiredLength, (this.country.originalDataPoints.length - 1));
        for (let i = startingIndex; i < (endIndex + 1); i++) {
            let day = this.country.originalDataPoints[i];
            set.push(day.rawGrowthCases);
        }
        return {
            n: set.length,
            standardDeviation: calculate.standardDeviation(set)
        };
    }

    get confidenceForFatalities() {
        let criticalValue95pct, standardDeviationInfo, standardDeviation, n;
        standardDeviationInfo = this.standardDeviationForFatalities;
        criticalValue95pct = 1.96;
        standardDeviation = standardDeviationInfo.standardDeviation;
        n = standardDeviationInfo.n;
        return criticalValue95pct * (standardDeviation / Math.sqrt(n));
    }

    get confidenceForCases() {
        let criticalValue95pct, standardDeviationInfo, standardDeviation, n;
        standardDeviationInfo = this.standardDeviationForCases;
        criticalValue95pct = 1.96;
        standardDeviation = standardDeviationInfo.standardDeviation;
        n = standardDeviationInfo.n;
        return criticalValue95pct * (standardDeviation / Math.sqrt(n));
    }

    getgrowth(smoothened, source) {
        let thisValue, previousValue;

        if (this.previous) {
            if (smoothened) {
                thisValue = this.getValue(source, true);
                previousValue = this.previous.getValue(source, true);
            } else {
                thisValue = this.delta_fatalities;
                previousValue = this.previous.delta_fatalities;
            }
            if (previousValue === 0) {
                return 1; // ??
            } else {
                return thisValue / previousValue;
            }
        } else {
            return 1; // ??
        }
    }


    getValue(type, smoothened, source, graphType) {
        let getTypeOfValue, cumulative, perCapita;
        cumulative = store.state.settings.cumulative;
        perCapita = store.state.settings.perCapita;

        if (type === 'growth') {
            if (smoothened) {
                getTypeOfValue = (dataPoint) => {
                    return dataPoint.getgrowth(true, source);
                };

                return this.smoothen(getTypeOfValue, graphType);
            } else {
                return this.getgrowth(true, source);
            }
        } else {
            if (smoothened) {
                if (cumulative) {
                    getTypeOfValue = (dataPoint) => {
                        if (perCapita) {
                            return dataPoint[type] / (this.country.population / 1000000)
                        } else {
                            return dataPoint[type];
                        }
                    };
                } else {
                    getTypeOfValue = (dataPoint) => {
                        if (perCapita) {
                            return dataPoint['delta_' + type] / (this.country.population / 1000000)
                        } else {
                            return dataPoint['delta_' + type];
                        }
                    };
                }


                return this.smoothen(getTypeOfValue, graphType);
            } else {
                if (cumulative) {
                    if (perCapita) {
                        return this[type] / (this.country.population / 1000000)
                    } else {
                        return this[type];
                    }
                } else {
                    if (perCapita) {
                        return this['delta_' + type] / (this.country.population / 1000000)
                    } else {
                        return this['delta_' + type];
                    }
                }
            }
        }
    }

    smoothen(getTypeOfValue, graphType) {
        let totalValue, thisIndex, startingIndex, endIndex, totalWeight,
            desiredLength, availableLength;
        totalWeight = 0;
        totalValue = 0;

        desiredLength = 6;
        thisIndex = this.index;
        if (store.state.settings.cumulative && graphType !== 'growth') {
            availableLength = Math.min(thisIndex, desiredLength);
            availableLength = Math.min(availableLength, (this.country.originalDataPoints.length - 1 - thisIndex));

            startingIndex = thisIndex - availableLength;
            endIndex = thisIndex + availableLength;
        } else {
            startingIndex = Math.max(thisIndex - desiredLength, 0) + 1;
            endIndex = Math.min(thisIndex + desiredLength, (this.country.originalDataPoints.length - 1)) - 1;
            availableLength = desiredLength;
        }
        for (let i = startingIndex; i < (endIndex + 1); i++) {
            let dataPoint, weight;
            dataPoint = this.country.originalDataPoints[i];
            weight = 1 + availableLength - Math.abs(i - thisIndex);
            totalValue += getTypeOfValue(dataPoint) * weight;
            totalWeight += weight;
        }
        return totalValue / totalWeight;
    }
}

export default Day;