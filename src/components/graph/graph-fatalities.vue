<script>
    import lineChart from "./line-chart";

    export default {
        name: 'graph-fatalities',
        components: {
            lineChart
        },
        props: {},
        computed: {
            countries() {
                return this.$store.state.countries.all.filter(c => c.active);
            },
            mapping() {
                return this.$store.state.settings.fatalities;
            },
            data() {
                return this.countries.map(c => {
                    let country = {...c};
                    country.dataPoints = [];
                    for (let entry of country.entries) {
                        if (entry.fatalities > this.mapping) {
                            let e = {...entry};
                            e.index = country.dataPoints.length + 1;
                            country.dataPoints.push(e);
                        }
                    }
                    delete country.entries;
                    return country;
                });
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="graph-fatalities">
        <line-chart :data="data"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-fatalities {

    }
</style>