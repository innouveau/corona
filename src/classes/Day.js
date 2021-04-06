import store from '@/store/store';

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


    getValue(type, smoothened, source, graphType, forceNonCumulative = false) {
        let getTypeOfValue, cumulative, perCapita;
        cumulative = store.state.settings.cumulative && !forceNonCumulative;
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


                return this.smoothen(getTypeOfValue, graphType, forceNonCumulative);
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

    smoothen(getTypeOfValue, graphType, forceNonCumulative = false) {
        let totalValue, startingIndex, desiredLength, availableLength;
        desiredLength = 7;
        totalValue = 0;
        availableLength = Math.min(this.index, desiredLength);
        startingIndex = this.index - availableLength + 1;
        for (let i = startingIndex; i <= this.index; i++) {
            let dataPoint = this.country.originalDataPoints[i];
            totalValue += getTypeOfValue(dataPoint);
        }
        return totalValue / (this.index - startingIndex + 1);
    }
}

export default Day;