<script>
    import lineChart from "./line-chart";

    export default {
        name: 'graph-cases',
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
            perCapita() {
                return this.$store.state.settings.perCapita;
            },
            logScale() {
                return this.$store.state.settings.logScale;
            },
            cumulative() {
                return this.$store.state.settings.cumulative;
            }
        },
        methods: {
            getValue(country, d) {
                let v, thisPointCases, prevPoint;
                thisPointCases = d.cases;
                if (this.cumulative) {
                    v = thisPointCases;
                } else {
                    if (d.index > 0) {
                        prevPoint = country.originalDataPoints[d.index - 1];
                        v = thisPointCases - prevPoint.cases;
                    } else {
                        v = thisPointCases;
                    }
                }

                if (this.perCapita) {
                    let value = (1000000 * v) / country.population;
                    // apparently value 0 is a problem for log
                    if (this.logScale && Math.round(value) === 0) {
                        return 1;
                    } else {
                        return Math.round(value);
                    }
                } else {
                    if (this.logScale && v === 0) {
                        return 0.00000001;
                    } else {
                        return v;
                    }
                }
            },
        }
    }
</script>


<template>
    <div
        class="graph-cases graph"
        :style="{'width': (100 / $parent.l) + '%'}">
        <h2>
             <span v-if="cumulative">
                Cumulative
            </span>
            Cases
            <span v-if="perCapita">
                per 1M capita
            </span>
        </h2>
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="true"
            :type="'cases'"/>
        <div class="graph__x-axis">
            {{$parent.xAxis}}
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-cases {

    }
</style>