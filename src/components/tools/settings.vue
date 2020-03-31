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
            mappingTypeOptions() {
                return ['fatalities', 'cases'];
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="settings tool">
        <div class="settings__row">
            Start at <input v-model="startAt" type="number"/> (absolute)
            <select
                v-model="mappingType">
                <option
                        v-for="option in mappingTypeOptions">
                    {{option}}
                </option></select>


        </div>
        <div class="settings__row">
            Stop at <input v-model="stopAt" type="number"/> days (or before if no data).
        </div>
        <div class="settings__row">
            Growth average per  <input v-model="growthRatePer" type="number"/> days.
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
            width: 40px;
            padding: 4px;
            margin: 0 4px;
        }

        select {
            margin-right: 10px;
        }
    }
</style>