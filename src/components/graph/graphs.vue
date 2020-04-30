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
                    country.originalDataPoints = [];
                    for (let entry of country.entries) {
                        let e = {...entry};
                        country.originalDataPoints.push(e);
                        if (this.isAboveMapping(entry, country) && this.isBeforeStop(country.dataPoints.length)) {
                            country.dataPoints.push(e);
                        }
                    }
                    delete country.entries;
                    return country;
                });
            },
            isAbsolute() {
                return this.$store.state.settings.mappingNumberStyle === 'absolute';
            },
            xAxis() {
                let string = '→ Days since ';
                if (this.mappingType === 'event') {
                    string += this.$store.state.settings.mappingEventType;
                } else if (this.mappingType === 'date') {
                    string += this.mappingDateString;
                } else {
                    string += this.$store.state.settings.mappingStartNumber + ' ' + this.$store.state.settings.mappingNumberStyle + ' ' +  this.$store.state.settings.mappingType;
                }
                return string;
            },
            mappingType() {
                return this.$store.state.settings.mappingType;
            },
            mappingDate() {
                return this.$store.state.settings.mappingDate;
            },
            mappingDateString() {
                let d = new Date(this.$store.state.settings.mappingDate);
                return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
            },
        },
        methods: {
            getTime(date) {
                return new Date(date).getTime();
            },
            isAboveMapping(entry, country) {
                if (this.mappingType === 'event') {
                    let event = this.getEvent(country, this.$store.state.settings.mappingEventType);
                    if (event) {
                        return this.getTime(entry.date) >= this.getTime(event.date);
                    } else {
                        return false;
                    }
                } else if (this.mappingType === 'date') {
                    return this.mappingDate && this.getTime(entry.date) >= this.mappingDate.getTime();
                } else {
                    if (this.isAbsolute) {
                        return entry[this.$store.state.settings.mappingType] >= this.$store.state.settings.mappingStartNumber;
                    } else {
                        let value = 1000000 * entry[this.$store.state.settings.mappingType] / country.population;
                        return value > this.$store.state.settings.mappingStartNumber;
                    }
                }
            },
            getEvent(country, type) {
                for (let event of country.events) {
                    if (event.type === type) {
                        return event;
                    }
                }
                return null;
            },
            isBeforeStop(l) {
                return l <= this.$store.state.settings.mappingMaxDays;
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
            font-size: 14px;
        }

        .graph__x-axis {
            margin-left: 50px;
            font-size: 9px;
        }

        @include mobile() {
            display: block;

            .graph {
                width: 100%!important;
                margin-bottom: 20px;
            }
        }
    }
</style>