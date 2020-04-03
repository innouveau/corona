<script>
    import lineChart from "./line-chart";

    export default {
        name: 'graph-fatalities',
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
            }
        },
        methods: {
            getValue(country, d) {
                if (this.perCapita) {
                    let value = (1000000 * d.fatalities) / country.population;
                    // apparently value 0 is a problem for log
                    if (this.logScale && (value === 0 || Math.round(value * 10) / 10 === 0)) {
                        return 0.00000001;
                    } else {
                        return Math.round(value * 10) / 10;
                    }
                } else {
                    return d.fatalities;
                }
            },
        }
    }
</script>


<template>
    <div
        class="graph-fatalities graph"
        :style="{'width': (100 / $parent.l) + '%'}">
        <h2>
            Fatalities
            <span v-if="perCapita">
                per 1M capita
            </span>
        </h2>
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="true"/>
        <div class="graph__x-axis">
            {{$parent.xAxis}}
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-fatalities {

    }
</style>