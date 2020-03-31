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
                return "hsl(" + 360 * Math.random() + ',' +
                    (25 + 70 * Math.random()) + '%,' +
                    (85 + 10 * Math.random()) + '%)';
            },
            loadCsv() {
                let cases, fatalities;

                d3.csv('data/cases.csv')
                    .then((response) => {
                        cases = response;
                        d3.csv('data/fatalities.csv')
                            .then((response) => {
                                fatalities = response;
                                this.convertData(cases, fatalities);
                            })
                            .catch((error) => {});
                    })
                    .catch((error) => {});
            },
            convertData(countriesWithCases, countriesWithFatalities) {
                let countries, counter;
                countries = [];
                counter = 0;

                const getCountry = function(countryName) {
                    for (let country of countriesWithFatalities) {
                        if (country.Country === countryName) {
                            return country;
                        }
                    }
                    return null;
                };

                for (let countryWithCases of countriesWithCases) {
                    let country, countryWithFatalities;

                    countryWithFatalities = getCountry(countryWithCases.Country);

                    country = {};
                    country.entries = [];
                    country.title = countryWithCases.Country;
                    country.id = countries.length + 1;
                    country.searchTags = '';
                    country.color = this.getRandomColor();
                    country.population = this.getPopulation(countryWithCases.Country);
                    for (let date in countryWithCases) {
                        if (date !== 'Country' && date !== '') {
                            let entry, casesForDate, fatalitiesForDate;
                            casesForDate = countryWithCases[date] !== '' ? Number(countryWithCases[date]) : 0;

                            if (countryWithFatalities && countryWithFatalities.hasOwnProperty(date)) {
                                fatalitiesForDate = countryWithFatalities[date] !== '' ? Number(countryWithFatalities[date]) : 0;
                            } else {
                                fatalitiesForDate = 0;
                            }

                            entry = {
                                date: date,
                                cases: casesForDate,
                                fatalities: fatalitiesForDate
                            };
                            country.entries.push(entry)
                        }
                    }


                    countries.push(country);
                    counter++;
                }
                this.loadData(countries);
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
                this.$store.commit('countries/init', countries);
                this.$store.commit('types/init', this.types);
                this.$store.commit('updateProperty', {key: 'dataLoaded', value: true});
                this.getQueryParameters();
            },
            getQueryParameters(){
                let countries, logscale, percapita, cutyaxis, startat, startattype, stopat, growthaverage;
                countries = this.$route.query.countries;
                logscale = this.$route.query.logscale;
                percapita = this.$route.query.percapita;
                cutyaxis = this.$route.query.cutyaxis;
                startat = this.$route.query.startat;
                startattype = this.$route.query.startattype;
                stopat = this.$route.query.stopat;
                growthaverage = this.$route.query.growthaverage;


                this.$store.commit('types/updatePropertyOfItem', {item: {id: 1}, property: 'active', value: true});
                this.$store.commit('types/updatePropertyOfItem', {item: {id: 2}, property: 'active', value: true});
                this.$store.commit('types/updatePropertyOfItem', {item: {id: 3}, property: 'active', value: true});

                if (countries && countries.length > 0) {
                    let cs, separator;
                    cs = countries.split(',');
                    separator = ':';
                    for (let string of cs) {
                        let country, colorString, countryName, color;
                        if (string.indexOf(separator) > -1) {
                            countryName = string.split(separator)[0];
                            color = string.split(separator)[1];
                        } else {
                            countryName = string;
                        }
                        country = this.$store.getters['countries/getItemByProperty']('title', countryName, true);
                        if (country) {
                            this.$store.commit('countries/updatePropertyOfItem', {item: {id: country.id}, property: 'active', value: true});
                            if (color) {
                                this.$store.commit('countries/updatePropertyOfItem', {item: {id: country.id}, property: 'color', value: color});
                            }
                        }
                    }
                } else {
                    // a predefined set
                    this.$store.commit('countries/updatePropertyOfItem', {item: {id: 2}, property: 'active', value: true});
                    this.$store.commit('countries/updatePropertyOfItem', {item: {id: 3}, property: 'active', value: true});
                    this.$store.commit('countries/updatePropertyOfItem', {item: {id: 42}, property: 'active', value: true});
                }

                if (logscale && logscale.length > 0 && logscale === 'true') {
                    this.$store.commit('settings/updateProperty', {key: 'logScale', value: true});
                }
                if (percapita && percapita.length > 0 && percapita === 'true') {
                    this.$store.commit('settings/updateProperty', {key: 'perCapita', value: true});
                }
                if (cutyaxis && cutyaxis.length > 0 && cutyaxis === 'true') {
                    this.$store.commit('settings/updateProperty', {key: 'cutY', value: true});
                }
                if (startat && startat.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'startAt', value: Number(startat)});
                }
                if (startattype && startattype.length > 0 && startattype === 'cases') {
                    this.$store.commit('settings/updateProperty', {key: 'mappingType', value: startattype});
                }
                if (stopat && stopat.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'stopAt', value: Number(stopat)});
                }
                if (growthaverage && growthaverage.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'growthRatePer', value: Number(growthaverage)});
                }
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