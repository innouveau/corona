<script>
    import tools from "@/components/tools/tools";
    import graphs from "@/components/graph/graphs";
    import * as d3 from 'd3';
    import shareUrl from "@/components/share-url";
    import description from "@/components/tools/description";
    import credits from "@/components/tools/credits";
    import updatedAt from "@/components/updated-at";
    import errorModal from "@/components/elements/error-modal";
    import color from '@/tools/color';
    import RegionInfo from "./components/tools/regions/region-info";
    import regionTool from '@/tools/regions';
    import loader from '@/tools/loader';

    export default {
        name: 'app',
        components: {
            RegionInfo,
            errorModal,
            updatedAt,
            credits,
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
                        id: 4,
                        title: 'Growth cases',
                        property: 'growth-cases'
                    }, {
                        id: 3,
                        title: 'Growth fatalities',
                        property: 'growth'
                    }
                ]
            }
        },
        computed: {
            dataLoaded() {
                return this.$store.state.dataLoaded;
            },
            showErrorModal() {
                return this.$store.state.errorModal.visible;
            },
            timestamp() {
                return '?time=' + new Date().getTime();
            },
            currentRegion() {
                return this.$store.state.ui.currentRegion;
            }
        },
        methods: {
            loadCsv() {
                Promise.all([
                    d3.csv('data/regions.csv' + this.timestamp),
                    d3.csv('data/events.csv' + this.timestamp),
                    d3.csv('data/starting-regions.csv' + this.timestamp),
                ]).then((files) => {
                    this.addRegions(files[0]);
                    this.connectParents(files[0]);
                    this.addEvents(files[1]);
                    this.getQueryParameters(files[2]);

                    this.$store.commit('updateProperty', {key: 'dataLoaded', value: true});
                }).catch((err) => {
                    console.log(err);
                })
            },
            addRegions(regions) {
                let counter, convertedRegions;
                counter = 0;
                convertedRegions = regions.map(region => {
                    counter++;
                    return {
                        id: counter,
                        population: Number(region.population),
                        title: region.region,
                        color: color.getRandom()
                    };
                });
                this.$store.commit('regions/init', convertedRegions);

            },
            connectParents(regions) {
                for (let regionData of regions) {
                    let region = this.$store.getters['regions/getItemByProperty']('title', regionData.region, true);
                    if (region) {
                        if (regionData.parent) {
                            let parent = this.$store.getters['parents/getItemByProperty']('title', regionData.parent, true);
                            if (!parent) {
                                let originalRegion = this.$store.getters['regions/getItemByProperty']('title', regionData.parent, true);
                                this.$store.commit('parents/create', {
                                    id: (this.$store.state.parents.all.length + 1),
                                    title: regionData.parent,
                                    originalRegion: originalRegion
                                });
                                parent = this.$store.getters['parents/getLastItem'];
                            }
                            this.$store.commit('regions/updatePropertyOfItem', {item: region, property: 'parent', value: parent});
                            this.$store.commit('parents/addChild', {item: parent, child: region})
                        }
                    }
                }
            },
            getQueryParameters(startingRegions){
                let regions, countries, description,
                    mappingType, mappingMaxDays, mappingStartNumber, mappingNumberStyle,
                    mappingEventType, mappingDate, logScale, perCapita, cutYaxis,
                    cumulative, smoothening, types, typeIds;
                regions = this.$route.query.regions;
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

                // catch previously used parameter countries
                if (countries && countries.length > 0 && (!regions || regions.length === 0)) {
                    regions = countries;
                }

                // regions
                if (regions && regions.length > 0) {
                    let cs, separator;
                    cs = regions.split(',');
                    separator = ':';
                    for (let string of cs) {
                        let region, colorString, regionName, color;
                        if (string.indexOf(separator) > -1) {
                            regionName = string.split(separator)[0];
                            colorString = string.split(separator)[1];
                            if (colorString.indexOf('hex') > -1) {
                                color = '#' + colorString.substr(3);
                            } else {
                                color = colorString;
                            }
                        } else {
                            regionName = string;
                        }
                        region = this.getRegionByTitle(regionName);
                        if (region) {
                            regionTool.selectRegion(region);
                            if (color) {
                                this.$store.commit('regions/updatePropertyOfItem', {item: {id: region.id}, property: 'color', value: color});
                            }
                        }
                    }
                } else {
                    this.activateStartingRegions(startingRegions);
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
                } else {
                    this.$store.commit('settings/updateProperty', {key: 'perCapita', value: true});
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
            getRegionByTitle(regionTitle) {
                let region, parent;
                region = this.$store.getters['regions/getItemByProperty']('title', regionTitle, true);
                // try parent
                if (!region) {
                    parent = this.$store.getters['parents/getItemByProperty']('title', regionTitle, true);
                    if (parent) {
                        regionTool.selectParentAsMerged(parent);
                        region = this.$store.getters['regions/getItemByProperty']('title', regionTitle, true);
                    }
                }
                return region;
            },
            activateStartingRegions(startingRegions) {
                for (let region of startingRegions) {
                    let item = this.getRegionByTitle(region.title);
                    if (item) {
                        this.$store.commit('regions/updatePropertyOfItem', {
                            item,
                            property: 'color',
                            value: region.color
                        });
                        regionTool.selectRegion(item);
                    }
                }
            },
            addEvents(events) {
                for (let event of events) {
                    this.addEventType(event.type);
                    this.$store.commit('regions/addEvent', {region: event.country, event: event});
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
            this.$store.commit('types/init', this.types);
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

        <div class="app__tools">
            <share-url/>
            <a href="https://datagraver.com/case/tool-for-comparing-countries-and-regions-on-covid-19-developments" target="_blank">
                <div class="rounded-icon">?</div> Help / explain
            </a>
        </div>

        <updated-at/>

        <region-info
            v-if="currentRegion"/>

        <error-modal v-if="showErrorModal"/>
        <credits/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .app {
        position: relative;

        .app__tools {
            position: fixed;
            right: 8px;
            top: 20px;
            display: flex;
            align-items: center;
            flex-direction: row-reverse;

            a {
                margin-right: 16px;
                color: #000;
                padding: 4px;
                border: 1px solid #000;
                text-decoration: none;
                display: flex;
                align-items: center;
                background: #ddd;

                &:hover {
                    background: #000;
                    color: #fff;

                    .help {
                        color: #000;
                    }
                };
            }
        }
    }

    .rounded-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        margin-right: 4px;
        border: 1px solid #000;
        background: #fff;
    }
</style>