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
            },
            title() {
                let string = '';
                if (this.cumulative) {
                    string += 'Cumulative ';
                }
                string += 'Cases';
                if (this.perCapita) {
                    string += ' per 1M capita';
                }
                return string;
            }
        },
        methods: {
            getValue(country, day, smoothened) {
                let value = day.getValue('cases', smoothened, '', 'cases');
                if (value <= 0 && this.logScale) {
                    return 0.1;
                } else {
                    return Math.max(value, 0);
                }
            }
        }
    }
</script>


<template>
    <div
        class="graph-cases graph"
        :style="{'width': (100 / $parent.l) + '%'}">
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="true"
            :type="'cases'"
            :title="title"
            :x-axis-label="$parent.xAxis"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-cases {

    }
</style>