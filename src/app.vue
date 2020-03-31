<script>
    import tools from "./components/tools/tools";
    import graphs from "./components/graph/graphs";
    import * as d3 from 'd3';

    export default {
        name: 'app',
        components: {
            graphs,
            tools
        },
        props: {},
        data() {
            return {
                types: [
                    {
                        id: 1,
                        title: 'Cases',
                        property: 'cases'
                    }, {
                        id: 2,
                        title: 'Fatalities',
                        property: 'fatalities'
                    }, {
                        id: 3,
                        title: 'Growth',
                        property: 'growth'
                    }
                ]
            }
        },
        computed: {
            dataLoaded() {
                return this.$store.state.dataLoaded;
            }
        },
        methods: {
            getRandomColor() {
                let letters, color;
                letters = '0123456789ABCDEF';
                color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            },
            loadCsv() {
                d3.csv('data/data.csv')
                    .then((data) => {
                        let countries = [];
                        for (let d of data) {
                            let country = {};
                            country.entries = [];
                            country.title = d.Country;
                            country.id = countries.length + 1;
                            country.searchTags = '';
                            country.color = this.getRandomColor();
                            country.population = this.getPopulation(d.Country);
                            for (let key in d) {
                                if (key !== 'Country') {
                                    let value, entry;
                                    value = d[key] !== '' ? Number(d[key]) : 0;
                                    entry = {
                                        date: key,
                                        fatalities: value
                                    };
                                    country.entries.push(entry)
                                }
                            }
                            countries.push(country);
                        }
                        this.loadData(countries);
                    })
                    .catch((error) => {
                        // handle error
                    })
            },
            getPopulation(countryName) {
                for (let country of window.population) {
                    if (country.country === countryName) {
                        return Number(country.population);
                    }
                }
                return 0
            },
            loadData(countries) {
                console.log(countries);
                this.$store.commit('countries/init', countries);
                this.$store.commit('types/init', this.types);
                this.$store.commit('updateProperty', {key: 'dataLoaded', value: true});

                // this.$store.commit('countries/updatePropertyOfItem', {item: {id: 1}, property: 'active', value: true});
                // this.$store.commit('countries/updatePropertyOfItem', {item: {id: 3}, property: 'active', value: true});
                this.$store.commit('countries/updatePropertyOfItem', {item: {id: 4}, property: 'active', value: true});
                // this.$store.commit('countries/updatePropertyOfItem', {item: {id: 8}, property: 'active', value: true});
                // this.$store.commit('countries/updatePropertyOfItem', {item: {id: 12}, property: 'active', value: true});
                this.$store.commit('countries/updatePropertyOfItem', {item: {id: 15}, property: 'active', value: true});
                //this.$store.commit('types/updatePropertyOfItem', {item: {id: 1}, property: 'active', value: true});
                this.$store.commit('types/updatePropertyOfItem', {item: {id: 2}, property: 'active', value: true});
                this.$store.commit('types/updatePropertyOfItem', {item: {id: 3}, property: 'active', value: true});
            }
        },
        mounted() {
            this.loadCsv();
        }
    }
</script>


<template>
    <div class="app">
        <tools/>
        <graphs
            v-if="dataLoaded"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .app {

    }
</style>