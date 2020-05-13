<script>
    import Region from '@/classes/Region';

    export default {
        name: 'search-result-region',
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
                this.$parent.$parent.search = '';
            }
        }
    }
</script>


<template>
    <div
        @click="select()"
        class="search-result-region search-result-button">
        <div class="search-result-button__main">
            {{region.title}}
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .search-result-button {
        border-bottom: 1px solid #ddd;
        position: relative;

        .search-result-button__main {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 8px;
            cursor: pointer;

            &:hover {
                background: #ddd;
            }
        }


    }
</style>