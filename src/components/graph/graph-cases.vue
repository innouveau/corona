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
            }
        },
        methods: {
            getValue(country, d) {
                if (this.perCapita) {
                    return (1000000 * d.cases) / country.population;
                } else {
                    return d.cases;
                }
            },
        }
    }
</script>


<template>
    <div
        class="graph-cases"
        :style="{'width': (100 / $parent.l) + '%'}">
        <h2>
            Cases
        </h2>
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="true"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-cases {

    }
</style>