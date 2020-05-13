<script>
    import Region from '@/classes/Region';

    export default {
        name: 'search-regions-region',
        components: {},
        props: {
            region: {
                type: Region,
                required: true
            }
        },
        computed: {},
        methods: {
            select() {
                this.$store.commit('regions/updatePropertyOfItem', {item: this.region, property: 'active', value: true});
                this.$parent.search = '';
            }
        }
    }
</script>


<template>
    <div
        @click="select()"
        class="search-regions-region">
        {{region.title}}
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .search-regions-region {
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