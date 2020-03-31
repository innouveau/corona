<script>
    import lineChart from "./line-chart";

    export default {
        name: 'graph-cases',
        components: {
            lineChart
        },
        props: {},
        computed: {
            countries() {
                return this.$store.state.countries.all.filter(c => c.active);
            },
            data() {
                return this.countries.map(c => {
                    let country = {...c};
                    country.dataPoints = [];
                    for (let entry of country.entries) {
                        if (this.$parent.isAboveMapping(entry) && this.$parent.isBeforeStop(country.dataPoints.length)) {
                            let e = {...entry};
                            e.index = country.dataPoints.length + 1;
                            country.dataPoints.push(e);
                        }
                    }
                    delete country.entries;
                    return country;
                });
            },
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