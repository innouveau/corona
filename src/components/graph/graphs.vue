<script>
    import graphFatalities from "./graph-fatalities";
    import graphGrowth from "./graph-growth";
    import GraphCases from "./graph-cases";

    export default {
        name: 'graphs',
        components: {
            GraphCases,
            graphGrowth,
            graphFatalities
        },
        props: {},
        computed: {
            showFatalities() {
                let fatalities = this.$store.getters['types/getItemByProperty']('property', 'fatalities');
                return fatalities.active;
            },
            showCases() {
                let cases = this.$store.getters['types/getItemByProperty']('property', 'cases');
                return cases.active;
            },
            showGrowth() {
                let growth = this.$store.getters['types/getItemByProperty']('property', 'growth');
                return growth.active;
            },
            l() {
                return this.$store.state.types.all.filter(t => t.active).length;
            },
            countries() {
                return this.$store.state.countries.all.filter(c => c.active);
            },
            data() {
                return this.countries.map(c => {
                    let country = {...c};
                    country.dataPoints = [];
                    for (let entry of country.entries) {
                        if (this.isAboveMapping(entry) && this.isBeforeStop(country.dataPoints.length)) {
                            let e = {...entry};
                            e.index = country.dataPoints.length + 1;
                            country.dataPoints.push(e);
                        }
                    }
                    delete country.entries;
                    return country;
                });
            },
        },
        methods: {
            isAboveMapping(entry) {
                return entry[this.$store.state.settings.mappingType] > this.$store.state.settings.startAt;
            },
            isBeforeStop(l) {
                return l < this.$store.state.settings.stopAt;
            }
        }
    }
</script>


<template>
    <div class="graphs">
        <graph-cases
                v-if="showCases"
                :data="data"/>

        <graph-fatalities
            v-if="showFatalities"
            :data="data"/>

        <graph-growth
            v-if="showGrowth"
            :data="data"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graphs {
        padding: 20px;
        display: flex;

        h2 {
            margin: 0 0 0 50px;
        }
    }
</style>