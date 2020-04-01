<script>
    import searchCountriesCountry from "./search-countries-country";
    export default {
        name: 'search-countries',
        components: {
            searchCountriesCountry
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
                    return this.$store.state.countries.all.filter(country => {
                        return !country.active &&
                            (country.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
                                country.searchTags.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
                    })
                }
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="search-countries">
        <input
            v-model="search"
            placeholder="Search country..."/>
        <div class="search-countries__results">
            <search-countries-country
                v-for="country in results"
                :country="country"/>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .search-countries {
        margin-bottom: 10px;
        width: 300px;
        height: 32px;
        position: relative;

        input {
            height: 100%;
            width: 100%;
        }

        .search-countries__results {
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