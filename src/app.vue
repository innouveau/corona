<script>
    import tools from "./components/tools/tools";
    import graphs from "./components/graph/graphs";
    import * as d3 from 'd3';
    import shareUrl from "./components/share-url";
    import description from "./components/tools/description";
    import Credits from "./components/tools/credits";
    import updatedAt from "./components/updated-at";

    export default {
        name: 'app',
        components: {
            updatedAt,
            Credits,
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
                let cases, fatalities, population, events;

                d3.csv('data/cases.csv')
                    .then((response) => {
                        cases = response;

                        d3.csv('data/fatalities.csv')
                            .then((response) => {
                                fatalities = response;

                                d3.csv('data/population.csv')
                                    .then((response) => {
                                        population = response;

                                        d3.csv('data/events.csv')
                                            .then((response) => {
                                                events = response;

                                                this.convertData(cases, fatalities, population);
                                                this.addEvents(events);
                                            })
                                            .catch((error) => {});
                                    })
                                    .catch((error) => {});
                            })
                            .catch((error) => {});
                    })
                    .catch((error) => {});
            },
            convertData(countriesWithCases, countriesWithFatalities, population) {
                let countries, counter, countryNameIndex;
                countries = [];
                counter = 0;
                countryNameIndex = 'Land/regio';

                const getCountry = function(countryName) {
                    for (let country of countriesWithFatalities) {
                        if (country[countryNameIndex] === countryName) {
                            return country;
                        }
                    }
                    return null;
                };

                for (let countryWithCases of countriesWithCases) {
                    let country, countryWithFatalities, countryName;

                    countryName = countryWithCases[countryNameIndex];
                    countryWithFatalities = getCountry(countryName);
                    country = {};
                    country.entries = [];
                    country.title = countryName;
                    country.id = countries.length + 1;
                    country.searchTags = '';
                    country.color = this.getRandomColor();
                    country.population = this.getPopulation(countryName, population);
                    for (let date in countryWithCases) {
                        if (date !== countryNameIndex && date !== '') {
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
            getPopulation(countryName, population) {
                for (let country of population) {
                    if (country.Country === countryName) {
                        return Number(country.Population);
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
                let countries, description,
                    mappingType, mappingMaxDays, mappingStartNumber, mappingNumberStyle,
                    mappingEventType, mappingDate, logScale, perCapita, cutYaxis,
                    cumulative, smoothening, types, typeIds;
                countries = this.$route.query.countries;
                description = this.$route.query.description;

                mappingType = this.$route.query.mappingType;
                mappingMaxDays = this.$route.query.mappingMaxDays;
                mappingStartNumber = this.$route.query.mappingStartNumber;
                mappingNumberStyle = this.$route.query.mappingNumberStyle;
                mappingEventType = this.$route.query.mappingEventType;
                mappingDate = this.$route.query.mappingDate;
                logScale = this.$route.query.logScale;
                perCapita = this.$route.query.perCapita;
                cutYaxis = this.$route.query.cutYaxis;
                cumulative = this.$route.query.cumulative;
                smoothening = this.$route.query.smoothening;
                types = this.$route.query.types;
                // activate types
                if (types) {
                    typeIds = types.split(',').map(t => Number(t));
                } else {
                    typeIds = [1,2,3];
                }

                for (let typeId of typeIds) {
                    this.$store.commit('types/updatePropertyOfItem', {item: {id: typeId}, property: 'active', value: true});
                }

                // countries
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
                    this.activatePredefinedCountries();
                }

                // register the settings
                if (mappingType && mappingType.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingType', value: mappingType});
                }
                if (mappingMaxDays && mappingMaxDays.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingMaxDays', value: Number(mappingMaxDays)});
                }
                if (mappingStartNumber && mappingStartNumber.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingStartNumber', value: Number(mappingStartNumber)});
                }
                if (mappingNumberStyle && mappingNumberStyle.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingNumberStyle', value: mappingNumberStyle});
                }
                if (mappingEventType && mappingEventType.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingEventType', value: mappingEventType});
                }
                if (mappingDate && mappingDate.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingDate', value: new Date(mappingDate)});
                }


                if (logScale && logScale.length > 0) {
                    if (logScale === 'true') {
                        this.$store.commit('settings/updateProperty', {key: 'logScale', value: true});
                    }
                } else {
                    //this.$store.commit('settings/updateProperty', {key: 'logScale', value: true});
                }

                if (perCapita && perCapita.length > 0) {
                    if (perCapita === 'true') {
                        this.$store.commit('settings/updateProperty', {key: 'perCapita', value: true});
                    }
                }

                if (cutYaxis && cutYaxis.length > 0) {
                    if (cutYaxis === 'true') {
                        this.$store.commit('settings/updateProperty', {key: 'cutYaxis', value: true});
                    }
                } else {
                    this.$store.commit('settings/updateProperty', {key: 'cutYaxis', value: true});
                }

                if (cumulative && cumulative.length > 0) {
                    if (cumulative === 'true') {
                        this.$store.commit('settings/updateProperty', {key: 'cumulative', value: true});
                    }
                } else {
                    //this.$store.commit('settings/updateProperty', {key: 'cumulative', value: true});
                }



                if (smoothening && smoothening.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'smoothening', value: Number(smoothening)});
                }


                if (description && description.length > 0) {
                    this.$store.commit('settings/updateProperty', {key: 'hasDescriptionViaQuery', value: true});
                    this.$store.commit('ui/updateProperty', {key: 'description', value: description});
                }
            },
            activatePredefinedCountries() {
                // let countries = [
                //     {
                //         title: 'Netherlands',
                //         color: 'orange'
                //     }, {
                //         title: 'Spain',
                //         color: 'red'
                //     }, {
                //         title: 'Italy',
                //         color: 'blue'
                //     }, {
                //         title: 'Belgium',
                //         color: 'black'
                //     }, {
                //         title: 'Hubei',
                //         color: 'purple'
                //     }, {
                //         title: 'Austria',
                //         color: 'green'
                //     }];

                let countries = [
                    {
                        title: 'Netherlands',
                        color: 'orange'
                    }];

                for (let country of countries) {
                    let item = this.$store.getters['countries/getItemByProperty']('title', country.title);
                    this.$store.commit('countries/updatePropertyOfItem', {
                        item,
                        property: 'active',
                        value: true
                    });
                    this.$store.commit('countries/updatePropertyOfItem', {
                        item,
                        property: 'color',
                        value: country.color
                    });
                }
            },
            addEvents(events) {
                for (let event of events) {
                    this.addEventType(event.type);
                    this.$store.commit('countries/addEvent', {country: event.country, event: event});
                }
            },
            addEventType(type) {
                let evenType = this.$store.getters['eventTypes/getItemByProperty']('tag', type, false);
                if (!evenType) {
                    this.$store.commit('eventTypes/create', {title: type, tag: type});
                    this.$store.commit('settings/toggleEventType', type);
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
        <description/>
        <tools/>
        <graphs
            v-if="dataLoaded"/>
        <share-url/>
        <updated-at/>
        <credits/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .app {
        position: relative;
    }
</style>