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
            }
        },
        methods: {
            getValue(country, d) {
                if (this.perCapita) {
                    return (1000000 * d.fatalities) / country.population;
                } else {
                    return d.fatalities;
                }
            },
        }
    }
</script>


<template>
    <div
        class="graph-fatalities"
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
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-fatalities {

    }
</style>