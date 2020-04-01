<script>
    import tools from "./components/tools/tools";
    import graphs from "./components/graph/graphs";
    import * as d3 from 'd3';
    import shareUrl from "./components/share-url";
    import description from "./components/tools/description";

    export default {
        name: 'app',
        components: {
            description,
            shareUrl,
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
                                index: country.entries.length,
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
                let countries, logscale, percapita, cutyaxis, startat, startattype, startatstyle, stopat, growthaverage, description;
                countries = this.$route.query.countries;
                logscale = this.$route.query.logscale;
                percapita = this.$route.query.percapita;
                cutyaxis = this.$route.query.cutyaxis;
                startat = this.$route.query.startat;
                startattype = this.$route.query.startattype;
                startatstyle = this.$route.query.startatstyle;
                stopat = this.$route.query.stopat;
                growthaverage = this.$route.query.growthaverage;
                description = this.$route.query.description;


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
                            colorString = string.split(separator)[1];
                            if (colorString.indexOf('hex') > -1) {
                                color = '#' + colorString.substr(3);
                            } else {
                                color = colorString;
                            }
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
                if (startatstyle && startatstyle.length > 0 && startatstyle === 'relative') {
                    this.$store.commit('settings/updateProperty', {key: 'startAtStyle', value: startatstyle});
                }
                if (stopat && stopat.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'stopAt', value: Number(stopat)});
                }
                if (growthaverage && growthaverage.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'growthRatePer', value: Number(growthaverage)});
                }
                if (description && description.length > 0) {
                    this.$store.commit('ui/updateProperty', {key: 'description', value: description});
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
        <description/>
        <graphs
            v-if="dataLoaded"/>
        <share-url/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .app {
        position: relative;
    }
</style>