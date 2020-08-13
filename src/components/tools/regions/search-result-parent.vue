<script>
    import colorTool from '@/tools/color';
    import { Swatches } from 'vue-color';
    import Parent from "@/classes/Parent";
    import regionTool from '@/tools/regions';

    export default {
        name: 'search-result-parent',
        components: {
            'swatches-picker': Swatches
        },
        props: {
            parent: {
                type: Parent,
                required: true
            }
        },
        data() {
            let color = colorTool.getRandom();
            return {
                isOpen: false,
                color: color,
                colorHex: color
            }
        },
        computed: {},
        methods: {
            select(sameColor) {
                regionTool.selectRegions(this.parent.regions);

                if (sameColor) {
                    for (let region of this.parent.regions) {
                        this.$store.commit('regions/updatePropertyOfItem', {item: region, property: 'color', value: this.color });
                    }
                }
                this.close();
            },
            selectMerged() {
                regionTool.selectParentAsMerged(this.parent);
                this.close();
            },
            toggle() {
                this.isOpen = !this.isOpen;
            },
            close() {
                this.$parent.$parent.search = '';
            }
        },
        watch: {
            colorHex() {
                this.color = this.colorHex.hex;
                this.isOpen = false;
            }
        }
    }
</script>


<template>
    <div class="search-result-parent">
        <div
            @click="select(false)"
            class="search-result-button">
            <div class="search-result-button__main">
                All regions in: {{parent.title}} ({{parent.regions.length}})
            </div>
        </div>
        <div class="search-result-button">
            <div
                @click="select(true)"
                class="search-result-button__main">
                All regions in: {{parent.title}} ({{parent.regions.length}}) Same color
            </div>
            <div
                @click="toggle()"
                class="search-result-button__color">
                <div
                    :style="{'background-color': color}"
                    class="color-swatch"></div>
            </div>
        </div>
        <div
            class="search-result-button">
            <div
                v-if="!parent.originalRegion && !parent.merged"
                    @click="selectMerged(true)"
                    class="search-result-button__main">
                {{parent.title}} as one merged result
            </div>
        </div>

        <swatches-picker
                v-if="isOpen"
                v-model="colorHex" />
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .search-result-parent {

        .search-result-button__main {
            background: #eee;
        }

        .search-result-button__color {
            position: absolute;
            right: 0;
            top: 0;
            width: 30px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            &:hover {
                background: #aaa;
            }
        }
    }
</style>