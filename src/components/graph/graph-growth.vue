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
                let index, days, value, growthNumbers, totalMultiply, multiply;
                totalMultiply = 0;
                multiply = 1;
                index = d.index;
                growthNumbers = [];
                days = Number(this.growthRatePer);
                for (let i = 0 ; i < (2 * days + 1); i++ ){
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
                        growthNumbers.push(thisGrowthNumber * multiply);
                    }




                    totalMultiply += multiply;
                    if (i > days) {
                        multiply--;
                    } else {
                        multiply++;
                    }
                }
                value = growthNumbers.reduce((a, b) => a + b, 0) / totalMultiply;
                return Math.round(value * 100) / 100;
            }
        }
    }
</script>


<template>
    <div
        class="graph-growth"
        :style="{'width': (100 / $parent.l) + '%'}">
        <h2>
            Growth Rate Fatalities
        </h2>
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="false"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-growth {

    }
</style>