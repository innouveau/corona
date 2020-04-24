<script>
    import lineChart from "./line-chart";

    export default {
        name: 'graph-growth',
        components: {
            lineChart
        },
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        computed: {
            growthRatePer() {
                return this.$store.state.settings.growthRatePer;
            }
        },
        methods: {
            getValue(country, d) {
                let index, days, value, totalMultiply, multiply, multiplyDict;
                multiplyDict = {};
                totalMultiply = 0;
                multiply = 1;
                index = d.index;
                days = Number(this.growthRatePer);


                const addToDict = function(growthNumber, multiply) {
                    if (!multiplyDict[multiply]) {
                        multiplyDict[multiply] = [];
                    }
                    multiplyDict[multiply].push(growthNumber);
                };

                const calculateDict = function() {
                    let value, n;
                    value = 0;
                    n = 0;
                    for (let key in multiplyDict) {
                        let k = Number(key);
                        // if for some rease a point is skipped, we have respect
                        // the dict mirror. So if one side is missing, the
                        // other side wont count;
                        if (multiplyDict[k].length === 2) {
                            value += multiplyDict[k][0] * k;
                            value += multiplyDict[k][1] * k;
                            n += 2 * k;
                        } else if (k === (days + 1)) {
                            // this is the center point
                            value += multiplyDict[k][0] * k;
                            n += k;
                        }
                    }
                    return value / n;
                };

                for (let i = 0 ; i < (2 * days + 1); i++ ) {
                    let thisGrowthNumber, point, prevPoint, thisIndex;
                    thisIndex = index - days + i;
                    if (thisIndex < 1) {
                        thisIndex = 1;
                    }
                    if (thisIndex > country.originalDataPoints.length - 1) {
                        thisIndex = country.originalDataPoints.length - 1;
                    }
                    point = country.originalDataPoints[thisIndex];
                    prevPoint = country.originalDataPoints[thisIndex - 1];

                    if (prevPoint.fatalities === 0 && point.fatalities > 0) {
                        // skip this
                    } else {
                        if (prevPoint.fatalities === 0 && point.fatalities === 0) {
                            // this is 0 / 0
                            thisGrowthNumber = 1;


                            if (point.fatalities === 0) {
                                // this is 0 / 0
                                thisGrowthNumber = 1;
                            } else {
                                // this is 1 / 0
                                // what should the ratio be like? lets keep it 1 for now
                                thisGrowthNumber = 2;
                            }
                        } else {
                            thisGrowthNumber = point.fatalities / prevPoint.fatalities;
                        }
                        addToDict(thisGrowthNumber, multiply);
                    }



                    totalMultiply += multiply;
                    if (i >= days) {
                        multiply--;
                    } else {
                        multiply++;
                    }
                }
                value = calculateDict();
                return Math.round(value * 100) / 100;
            }
        }
    }
</script>


<template>
    <div
        class="graph-growth graph"
        :style="{'width': (100 / $parent.l) + '%'}">
        <h2>
            Growth Rate Fatalities
        </h2>
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="false"
            :type="'growth'"/>
        <div class="graph__x-axis">
            {{$parent.xAxis}}
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-growth {

    }
</style>