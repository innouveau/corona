<script>
    export default {
        name: 'map-tools',
        components: {},
        props: {},
        computed: {
            fatalities: {
                set(value) {
                    this.$store.commit('mapping/updateProperty', {key: 'fatalities', value})
                },
                get() {
                    return this.$store.state.mapping.fatalities;
                }
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="map-tools">
        Map fatalities at <input v-model="fatalities"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .map-tools {
        border-bottom: 2px solid #aaa;
        padding: 10px 0;

        input {
            width: 30px;
            padding: 4px;
            margin: 0 4px;
        }
    }
</style>