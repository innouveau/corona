<script>
    import lineChart from "./line-chart";

    export default {
        name: 'graph-growth',
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
        methods: {
            getValue(country, d) {
                let index = country.dataPoints.indexOf(d);
                if (index > 0) {
                    let prev = country.dataPoints[index - 1];
                    return d.fatalities / prev.fatalities;
                } else {
                    return 1;
                }
            }
        }
    }
</script>


<template>
    <div class="graph-growth">
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