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

    getgrowth(smoothened) {
        let thisValue, previousValue;

        if (this.previous) {
            if (smoothened) {
                thisValue = this.getValue('fatalities', true);
                previousValue = this.previous.getValue('fatalities', true);
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


    getValue(type, smoothened) {
        let getTypeOfValue, cumulative, perCapita;
        cumulative = store.state.settings.cumulative;
        perCapita = store.state.settings.perCapita;

        if (type === 'growth') {
            if (smoothened) {
                getTypeOfValue = (dataPoint) => {
                    return dataPoint.getgrowth(true);
                };

                return this.smoothen(getTypeOfValue);
            } else {
                return this.getgrowth(true);
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


                return this.smoothen(getTypeOfValue);
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

    smoothen(getTypeOfValue) {
        let totalValue, thisIndex, startingIndex, endIndex, totalWeight, rollingNumber;
        rollingNumber = 7;
        totalValue = 0;
        totalWeight = 0;
        thisIndex = this.index;
        startingIndex = Math.max(thisIndex - rollingNumber, 0) + 1;
        endIndex = Math.min(thisIndex + rollingNumber, (this.country.originalDataPoints.length - 1)) - 1;
        for (let i = startingIndex; i < (endIndex + 1); i++) {
            let dataPoint, weight;
            dataPoint = this.country.originalDataPoints[i];
            weight = rollingNumber - Math.abs(i - thisIndex);

            totalValue += getTypeOfValue(dataPoint) * weight;
            //console.log('x ' + weight);
            totalWeight += weight;
        }
        //console.log('total weight ' + totalWeight);
        return totalValue / totalWeight;
    }
}

export default Day;