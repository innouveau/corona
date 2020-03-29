<script>
    export default {
        name: 'map-tools',
        components: {},
        props: {},
        computed: {
            fatalities: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'fatalities', value})
                },
                get() {
                    return this.$store.state.settings.fatalities;
                }
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="map-tools tool">
        Start at <input v-model="fatalities"/> (absolute) fatalities.
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .map-tools {

        input {
            width: 40px;
            padding: 4px;
            margin: 0 4px;
        }
    }
</style>