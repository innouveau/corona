<script>
    import searchResultRegion from "./search-result-region";
    import searchResultParent from "./search-result-parent";

    export default {
        name: 'search-result',
        components: {
            searchResultParent,
            searchResultRegion
        },
        props: {
            result: {
                type: Object,
                required: true
            }
        },
        computed: {},
        methods: {}
    }
</script>


<template>
    <div class="search-result">
        <search-result-region
            v-if="result.type === 'region'"
            :region="result.item"/>
        <search-result-parent
            v-if="result.type === 'parent'"
            :parent="result.item"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .search-result {

    }
</style>