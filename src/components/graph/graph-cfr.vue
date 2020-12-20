<script>
    import lineChart from "./line-chart";
    import consts from '@/data/consts';

    export default {
        name: 'graph-cfr',
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
            },
            title() {
                return 'CFR';
            }
        },
        methods: {
            getValue(country, day, smoothened) {
                let shift, getTypeOfValue;
                shift = this.$store.state.settings.shift;

                getTypeOfValue = (dataPoint) => {
                    return dataPoint.getCfr(country, shift);
                };
                return day.smoothen(getTypeOfValue, 'cfr');
            }
        }
    }
</script>


<template>
    <div
        class="graph-cfr graph"
        :style="{'width': (100 / $parent.l) + '%'}">
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="false"
            :type="'cfr'"
            :title="title"
            :x-axis-label="$parent.xAxis"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-cfr {

    }
</style>