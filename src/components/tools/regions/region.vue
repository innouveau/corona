<script>
    import Region from '@/classes/Region';
    import regionColor from "./region-color";
    import RegionVisible from "./region-visible";

    export default {
        name: 'region',
        components: {
            RegionVisible,
            regionColor
        },
        props: {
            region: {
                type: Region,
                required: true
            }
        },
        computed: {
            isVisible() {
                return this.region.visible;
            }
        },
        methods: {
            deleteRegion() {
                this.$store.commit('regions/updatePropertyOfItem', {item: this.region, property: 'active', value: false})
            }
        }
    }
</script>


<template>
    <div
        :class="{'region--visible': isVisible}"
        :style="{'border-bottom': '3px solid ' + region.color}"
        class="region">
        <region-visible
            :region="region"/>
        <region-color
            :region="region"/>
        <div class="region__title">
            {{region.title}}
        </div>
        <div
            @click="deleteRegion()"
            class="region__remove">×</div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .region {
        display: flex;
        align-items: center;
        box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        margin: 0 12px 8px 0;
        opacity: 0.3;
        transition: opacity 0.2s ease;
        background: #eee;

        .region__title {
            padding: 2px 6px;
            border-right: 1px solid #ddd;
            height: 100%;
        }

        .region__remove {
            cursor: pointer;
            background: #555;
            color: #fff;
            width: 12px;
            height: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin: 4px;

            &:hover {
                background: red;
            }
        }

        &.region--visible {
            opacity: 1;
        }
    }
</style>