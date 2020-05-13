<script>
    import SearchResult from "./search-result";

    export default {
        name: 'search-regions',
        components: {
            SearchResult
        },
        data() {
            return {
                search: ''
            }
        },
        props: {},
        computed: {
            results() {
                if (this.search === '') {
                    return [];
                } else {
                    let results = [];

                    const findParentResult = function(parent) {
                        for (let result of results) {
                            if (result.type === 'parent' && result.title === parent) {
                                return result;
                            }
                        }
                        return null;
                    };

                    for (let region of this.$store.state.regions.all) {
                        if (!region.active && region.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1) {
                            results.push({
                                type: 'region',
                                item: region
                            })
                        }
                    }

                    for (let parent of this.$store.state.parents.all) {
                        if (parent.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1) {
                            results.push({
                                type: 'parent',
                                item: parent
                            })
                        }
                    }
                    return results;
                }
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="search-regions">
        <input
            v-model="search"
            placeholder="Search country / region..."/>
        <div class="search-regions__results">
            <search-result
                v-for="result in results"
                :result="result"/>

        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .search-regions {
        margin-bottom: 10px;
        width: 300px;
        height: 32px;
        position: relative;

        input {
            height: 100%;
            width: 100%;
        }

        .search-regions__results {
            position: absolute;
            left: 0;
            top: 100%;
            width: 100%;
            background: #fff;
            box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
            max-height: 300px;
            overflow: auto;
            z-index: 10;
        }
    }
</style>