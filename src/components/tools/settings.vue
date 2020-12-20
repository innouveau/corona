<script>
    import Datepicker from 'vuejs-datepicker';
    import vSelect from 'vue-select';
    import 'vue-select/dist/vue-select.css';
    import GraphSettings from "./dashboard/graph-settings";


    export default {
        name: 'settings',
        components: {
            GraphSettings,
            Datepicker,
            vSelect
        },
        props: {},
        computed: {
            mappingStartNumber: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingStartNumber', value})
                },
                get() {
                    return this.$store.state.settings.mappingStartNumber;
                }
            },
            mappingMaxDays: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingMaxDays', value})
                },
                get() {
                    return this.$store.state.settings.mappingMaxDays;
                }
            },
            smoothening: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'smoothening', value})
                },
                get() {
                    return this.$store.state.settings.smoothening;
                }
            },
            mappingType: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingType', value})
                },
                get() {
                    return this.$store.state.settings.mappingType;
                }
            },
            mappingNumberStyle: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingNumberStyle', value})
                },
                get() {
                    return this.$store.state.settings.mappingNumberStyle;
                }
            },
            mappingEventType: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingEventType', value})
                },
                get() {
                    return this.$store.state.settings.mappingEventType;
                }
            },
            mappingDate: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'mappingDate', value})
                },
                get() {
                    return this.$store.state.settings.mappingDate;
                }
            },
            shift: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'shift', value})
                },
                get() {
                    return this.$store.state.settings.shift;
                }
            },
            //
            mappingTypeOptions() {
                return ['fatalities', 'cases', 'event', 'date'];
            },
            mappingNumberStyles() {
                return ['absolute', 'relative'];
            },
            mappingEventTypeOptions() {
                return this.$store.state.eventTypes.all.map(e => e.tag);
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="settings tool">
        <div class="settings__row">
            <div class="settings__info-cell">
                Type of mapping
            </div>
            <div class="settings__row-content">
                <v-select
                        v-model="mappingType"
                        :options="mappingTypeOptions"
                        :clearable="false"
                        class="v-select--special"/>
            </div>

        </div>
        <div class="settings__row settings__row--string">
            <div class="settings__info-cell">
                Start at
            </div>
            <div class="settings__row-content">
                <input
                        v-if="mappingType === 'fatalities' || mappingType === 'cases'"
                        v-model="mappingStartNumber" type="number"/>

                <v-select
                        v-if="mappingType === 'fatalities' || mappingType === 'cases'"
                        v-model="mappingNumberStyle"
                        :options="mappingNumberStyles"
                        :clearable="false"/>

                <v-select
                        v-if="mappingType === 'event'"
                        v-model="mappingEventType"
                        :options="mappingEventTypeOptions"
                        :clearable="false"/>

                <span v-if="mappingType !== 'date'">
                {{mappingType}}
            </span>


                <datepicker
                        v-if="mappingType === 'date'"
                        v-model="mappingDate"/>
            </div>


        </div>
        <div class="settings__row">
            <div class="settings__info-cell">
                Stop at
            </div>
            <div class="settings__row-content">
                <input
                        v-model="mappingMaxDays"
                        type="number"/>
                days (or before if no data).
            </div>
        </div>
        <div class="settings__row">
            <div class="settings__info-cell">
                Graph settings
            </div>
            <div class="settings__row-content">
                <graph-settings/>
            </div>
        </div>
        <div class="settings__row">
            <div class="settings__info-cell">
                Shift
            </div>
            <div class="settings__row-content">
                <input
                    v-model="shift"
                    type="number"/>
            </div>
        </div>

        <!--        <div class="settings__row">-->
<!--            <div class="settings__info-cell">-->
<!--                Smoothen Growth Rate over-->
<!--            </div>-->
<!--            <div class="settings__row-content">-->
<!--                <input class="input&#45;&#45;small" v-model="smoothening" type="number"/> days.-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .settings {

        .settings__row {
            margin-bottom: 2px;
            display: flex;
            align-items: center;

            .settings__info-cell {
                width: 100px;
                line-height: 1;
            }

            .settings__row-content {
                display: flex;
                align-items: center;

                .vdp-datepicker {

                    input {
                        width: 100px;
                    }
                }
            }
        }

        input {
            width: 50px;
            padding: 4px;
            margin: 0 4px;
            height: 20px;
            background: $tool-color;
            color: #fff;
            border: 1px solid #555;

            &.input--small {
                width: 30px;
            }

            &::selection {
                background: pink;
            }
        }

        select {
            margin-right: 4px;
        }

        .v-select {
            margin: 0 4px;
            border: 1px solid #555;

            input {
                display: none;
            }

            .vs__selected-options {
                display: flex;
                align-items: center;
                height: 20px;
                cursor: pointer;

                .vs__selected {
                    color: #fff;
                    margin: 0;
                    padding: 2px 4px;
                    display: block;
                    opacity: 1!important;
                    position: relative!important;
                }

            }

            .vs__dropdown-toggle {
                border-radius: 0;
                background: $tool-color;
                border: 0;
                padding: 0;
                cursor: pointer;

                .vs__actions {
                    transform: scale(0.5);

                    svg {
                        transition: none;

                        path {
                            fill: #fff;
                        }
                    }
                }
            }

            .vs__dropdown-menu {
                background: $tool-color;
                border-radius: 0;

                li {
                    text-transform: capitalize;
                }

            }

            &.v-select--special {

                .vs__selected-options {

                    .vs__selected {
                        color: #000;
                    }
                }

                .vs__dropdown-toggle {
                    background: orange;
                    color: #000;
                    font-weight: 700;

                    .vs__actions {

                        svg {

                            path {
                                fill: #000;
                            }
                        }
                    }
                }

                .vs__dropdown-menu {
                    background: orange;
                }
            }
        }
    }
</style>