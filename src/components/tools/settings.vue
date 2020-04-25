<script>
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: 'settings',
        components: {
            Datepicker
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
                return [{
                        tag: 'absolute',
                        title: 'absolute'
                    }, {
                        tag: 'relative',
                        title: 'Per 1M capita'
                    }];
            },
            mappingEventTypeOptions() {
                return ['schoolclosing', 'lockdown']
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

            <select
                v-if="mappingType === 'fatalities' || mappingType === 'cases'"
                v-model="mappingNumberStyle">
                <option
                        v-for="option in mappingNumberStyles"
                        :value="option.tag">
                    {{option.title}}
                </option></select>

            <select v-model="mappingType">
                <option
                        v-for="option in mappingTypeOptions">
                    {{option}}
                </option></select>

            <select
                v-if="mappingType === 'event'"
                v-model="mappingEventType">
                <option
                        v-for="option in mappingEventTypeOptions">
                    {{option}}
                </option></select>

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

        input {
            width: 50px;
            padding: 4px;
            margin: 0 4px;

            &.input--small {
                width: 30px;
            }
        }

        select {
            margin-right: 4px;
        }
    }
</style>