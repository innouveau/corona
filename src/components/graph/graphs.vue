<script>
    import graphFatalities from "./graph-fatalities";

    export default {
        name: 'graphs',
        components: {
            graphFatalities
        },
        props: {},
        computed: {
            showFatalities() {
                let fatalities = this.$store.getters['types/getItemByProperty']('property', 'fatalities');
                return fatalities.active;
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="graphs">
        <graph-fatalities
            v-if="showFatalities"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graphs {
        padding: 20px;
    }
</style>