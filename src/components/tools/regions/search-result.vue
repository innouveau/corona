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
            :region="result.region"/>
        <search-result-parent
            v-if="result.type === 'parent'"
            :result="result"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .search-result {

    }
</style>