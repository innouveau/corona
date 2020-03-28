<script>
    import country from "./country";

    export default {
        name: 'country-picker',
        components: {
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
    <div class="country-picker">
        <country
            v-for="country in countries"
            :country="country"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .country-picker {
        border-bottom: 2px solid #aaa;
        padding: 10px 0;
    }
</style>