<script>
    import searchRegionsRegion from "./search-regions-region";

    export default {
        name: 'search-regions',
        components: {
            searchRegionsRegion
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
                    return this.$store.state.regions.all.filter(region => {
                        return !region.active &&
                            (region.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
                                region.searchTags.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
                    })
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
            <search-regions-region
                v-for="region in results"
                :region="region"/>
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