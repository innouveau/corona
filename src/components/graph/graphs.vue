<script>
    import graphFatalities from "./graph-fatalities";
    import graphGrowth from "./graph-growth";

    export default {
        name: 'graphs',
        components: {
            graphGrowth,
            graphFatalities
        },
        props: {},
        computed: {
            showFatalities() {
                let fatalities = this.$store.getters['types/getItemByProperty']('property', 'fatalities');
                return fatalities.active;
            },
            showGrowth() {
                let growth = this.$store.getters['types/getItemByProperty']('property', 'growth');
                return growth.active;
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="graphs">
        <graph-fatalities
            v-if="showFatalities"/>

        <graph-growth
            v-if="showGrowth"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graphs {
        padding: 20px;
        display: flex;
    }
</style>