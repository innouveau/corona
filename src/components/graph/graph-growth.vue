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
            },
            growthFatalitiesActive() {
                return this.$store.getters['types/getItemByProperty']('property', 'growth').active;
            },
            growthCasesActive() {
                return this.$store.getters['types/getItemByProperty']('property', 'growth-cases').active;
            }
        },
        methods: {
            getValueForPoint(country, index) {
                return country.originalDataPoints[index].fatalities;
            },
            getValue(country, day, smoothened, valueForMinMax) {
                let source = this.source;
                // sync the two growth graphs

                function regionHasFatalityInfo(country) {
                    for (let day of country.originalDataPoints) {
                        if (day.fatalities > 0) {
                            return true;
                        }
                    }
                    return false;
                }

                if (valueForMinMax) {
                    if (this.growthFatalitiesActive && regionHasFatalityInfo(country)) {
                        source = 'fatalities';
                    } else {
                        source = 'cases';
                    }
                }
                if (smoothened) {
                    return day.getValue('growth', true, source, 'growth');
                } else {
                    return day.getValue('growth', false, source, 'growth');
                }
            },
            getInterval(region, d) {
                return 0.05;
                // let p, n;
                // n = d[this.source];
                // if (n === 0) {
                //     return 1;
                // } else {
                //     p = this.getValue(region, d, true);
                //     let v = 2 * Math.sqrt((p * ( 1 - p)) / n);
                //     if (isNaN(v)) {
                //         console.log('-');
                //         console.log(p);
                //         console.log(n);
                //     }
                //     return v;
                // }

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