<script>
    import Country from '@/classes/Country';

    export default {
        name: 'search-countries-country',
        components: {},
        props: {
            country: {
                type: Country,
                required: true
            }
        },
        computed: {},
        methods: {
            select() {
                this.$store.commit('countries/updatePropertyOfItem', {item: this.country, property: 'active', value: true});
                this.$parent.search = '';
            }
        }
    }
</script>


<template>
    <div
        @click="select()"
        class="search-countries-country">
        {{country.title}}
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .search-countries-country {
        padding: 8px;
        border-bottom: 1px solid #ddd;
        cursor: pointer;

        &:hover {
            background: #ddd;
        }

        &:last-child {
            border-bottom: 0;
        }
    }
</style>