<script>
    import Region from '@/classes/Region';
    import loader from '@/tools/loader';

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
                if (!this.region.dataLoaded) {
                    loader.loadRegion(this.region).then(result => {
                        this.$store.commit('regions/updatePropertyOfItem', {item: this.region, property: 'active', value: true});
                    })
                } else {
                    this.$store.commit('regions/updatePropertyOfItem', {item: this.region, property: 'active', value: true});
                }


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
            <div
                v-if="region.parent && region.parent.originalRegion"
                class="region__parent">
                ({{region.parent.title}})
            </div>
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

            .region__parent {
                margin-left: 4px;
            }

            &:hover {
                background: #ddd;
            }
        }


    }
</style>