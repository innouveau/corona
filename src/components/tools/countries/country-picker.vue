<script>
    import country from "./country";
    import selectedCountries from "./selected-countries";
    import searchCountries from "./search-countries";

    export default {
        name: 'country-picker',
        components: {
            searchCountries,
            selectedCountries,
            country
        },
        props: {},
        computed: {
            countries() {
                return this.$store.state.countries.all;
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="country-picker tool">
        <search-countries/>
        <selected-countries/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .country-picker {

    }
</style>