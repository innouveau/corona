<script>
    import region from "./region";
    import selectedRegions from "./selected-regions";
    import searchRegions from "./search-regions";

    export default {
        name: 'region-picker',
        components: {
            searchRegions,
            selectedRegions,
            region
        },
        props: {},
        computed: {
            regions() {
                return this.$store.state.regions.all;
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="region-picker tool">
        <search-regions/>
        <selected-regions/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .region-picker {

    }
</style>