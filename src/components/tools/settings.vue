<script>
    import Datepicker from 'vuejs-datepicker';
    import vSelect from 'vue-select';
    import 'vue-select/dist/vue-select.css';


    export default {
        name: 'settings',
        components: {
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
            //
            mappingTypeOptions() {
                return ['fatalities', 'cases', 'event', 'date'];
            },
            mappingNumberStyles() {
                return ['absolute', 'relative'];
            },
            mappingEventTypeOptions() {
                return ['schoolclosing', 'lockdown'];
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="settings tool">
        <div class="settings__row settings__row--string">
            Start at
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

            <v-select
                v-model="mappingType"
                :options="mappingTypeOptions"
                :clearable="false"
                class="v-select--special"/>

            <datepicker
                v-if="mappingType === 'date'"
                v-model="mappingDate"/>
        </div>
        <div class="settings__row">
            Stop at
            <input
                v-model="mappingMaxDays"
                type="number"/>
            days (or before if no data).
        </div>
        <div class="settings__row">
            Smoothen Growth Rate over <input class="input--small" v-model="smoothening" type="number"/> days.
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .settings {

        .settings__row {
            margin-bottom: 2px;

            > input {
                width: 50px;
                padding: 4px;
                margin: 0 4px;
                height: 28px;
                background: $tool-color;
                color: #fff;
                border: 1px solid #555;

                &.input--small {
                    width: 30px;
                }
            }

            &.settings__row--string {
                display: flex;
                align-items: center;

                .vdp-datepicker {

                    input {
                        width: 80px;
                    }
                }
            }
        }

        select {
            margin-right: 4px;
        }

        .v-select {
            margin: 0 4px;
            border: 1px solid #555;

            .vs__selected-options {
                display: flex;
                align-items: center;
                height: 28px;
                cursor: pointer;

                .vs__selected {
                    color: #fff;
                    margin: 0;
                    padding: 2px 4px;
                }

            }

            .vs__dropdown-toggle {
                border-radius: 0;
                background: $tool-color;
                border: 0;
                padding: 0;

                .vs__actions {
                    transform: scale(0.5);

                    svg {

                        path {
                            fill: #fff;
                        }
                    }
                }
            }

            &.v-select--special {

                .vs__dropdown-toggle {
                    background: #000;
                }
            }
        }
    }
</style>