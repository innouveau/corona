<script>
    import region from "./region";

    export default {
        name: 'selected-regions',
        components: {
            region
        },
        props: {},
        computed: {
            regions() {
                return this.$store.state.regions.all.filter(c => c.active);
            }
        },
        methods: {
            removeAll() {
                for (let region of this.regions) {
                    this.$store.commit('regions/updatePropertyOfItem', {item: region, property: 'active', value: false})
                }
            }
        }
    }
</script>


<template>
    <div class="selected-regions">
        <div class="selected-regions__regions">
            <region
                    v-for="region in regions"
                    :region="region"/>

            <div
                v-if="regions.length > 1"
                @click="removeAll()"
                class="text-button">
                Remove all regions
            </div>
        </div>

        <div>
            <span class="comment">Colors are generated randomly (or set via the url). You can click on the color swatch to change it.</span>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .selected-regions {

        .selected-regions__regions {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 8px;
        }

        .comment {
            color: #aaa;
            font-style: italic;
        }
    }

    .text-button {
        border: 1px solid #ddd;
        padding: 2px 4px;
        height: 24px;
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-left: 4px;
    }
</style>