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
            },
            source: {
                type: String,
                required: true
            }
        },
        computed: {
            smoothening() {
                return this.$store.state.settings.smoothening;
            },
            title() {
                if (this.cumulative) {
                    return 'Growth rate ' + this.source + ' on cumulative';
                } else {
                    return 'Growth rate ' + this.source;
                }
            },
            cumulative() {
                return this.$store.state.settings.cumulative;
            }
        },
        methods: {
            getValueForPoint(country, index) {
                return country.originalDataPoints[index].fatalities;
            },
            getValue(country, day, smoothened, valueForMinMax) {
                let source = this.source;
                // sync the two growth graphs
                if (valueForMinMax) {
                    source = 'cases';
                }
                if (smoothened) {
                    return day.getValue('growth', true, source, 'growth');
                } else {
                    return day.getValue('growth', false, source, 'growth');
                }
            },
            getValue2(country, d) {
                let index, days, value, totalMultiply, multiply, multiplyDict;
                multiplyDict = {};
                totalMultiply = 0;
                multiply = 1;
                index = d.index;
                days = Number(this.smoothening);


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
                    point = this.getValueForPoint(country, thisIndex);
                    prevPoint = this.getValueForPoint(country, (thisIndex - 1));

                    if (prevPoint === 0 && point > 0) {
                        // skip this
                    } else {
                        if (prevPoint === 0 && point === 0) {
                            // this is 0 / 0
                            thisGrowthNumber = 1;


                            if (point === 0) {
                                // this is 0 / 0
                                thisGrowthNumber = 1;
                            } else {
                                // this is 1 / 0
                                // what should the ratio be like? lets keep it 1 for now
                                thisGrowthNumber = 2;
                            }
                        } else {
                            thisGrowthNumber = point / prevPoint;
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
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="false"
            :type="'growth'"
            :title="title"
            :x-axis-label="$parent.xAxis"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-growth {

    }
</style>