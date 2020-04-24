<script>
    export default {
        name: 'settings',
        components: {},
        props: {},
        computed: {
            startAt: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'startAt', value})
                },
                get() {
                    return this.$store.state.settings.startAt;
                }
            },
            stopAt: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'stopAt', value})
                },
                get() {
                    return this.$store.state.settings.stopAt;
                }
            },
            growthRatePer: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'growthRatePer', value})
                },
                get() {
                    return this.$store.state.settings.growthRatePer;
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
            startAtStyle: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'startAtStyle', value})
                },
                get() {
                    return this.$store.state.settings.startAtStyle;
                }
            },
            eventType: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'eventType', value})
                },
                get() {
                    return this.$store.state.settings.eventType;
                }
            },
            //
            mappingTypeOptions() {
                return ['fatalities', 'cases', 'event'];
            },
            startAtStyles() {
                return [{
                        tag: 'absolute',
                        title: 'absolute'
                    }, {
                        tag: 'relative',
                        title: 'Per 1M capita'
                    }];
            },
            eventTypeOptions() {
                return ['schoolclosing', 'lockdown']
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="settings tool">
        <div class="settings__row">
            Start at
            <input
                v-if="mappingType !== 'event'"
                v-model="startAt" type="number"/>

            <select
                v-if="mappingType !== 'event'"
                v-model="startAtStyle">
                <option
                        v-for="option in startAtStyles"
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
                v-model="eventType">
                <option
                        v-for="option in eventTypeOptions">
                    {{option}}
                </option></select>
        </div>
        <div class="settings__row">
            Stop at <input v-model="stopAt" type="number"/> days (or before if no data).
        </div>
        <div class="settings__row">
            Smoothen Growth Rate over <input class="input--small" v-model="growthRatePer" type="number"/> days.
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .settings {

        .settings__row {
            margin-bottom: 2px;
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