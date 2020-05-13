<script>
    import colorTool from '@/tools/color';
    import { Swatches } from 'vue-color';

    export default {
        name: 'search-result-parent',
        components: {
            'swatches-picker': Swatches
        },
        props: {
            result: {
                type: Object,
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
                for (let region of this.result.regions) {
                    this.$store.commit('regions/updatePropertyOfItem', {item: region, property: 'active', value: true});
                    if (sameColor) {
                        this.$store.commit('regions/updatePropertyOfItem', {
                            item: region,
                            property: 'color',
                            value: this.color
                        });
                    }
                }
                this.$parent.$parent.search = '';
            },
            toggle() {
                this.isOpen = !this.isOpen;
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
                All regions in: {{result.title}} ({{result.regions.length}})
            </div>
        </div>
        <div class="search-result-button">
            <div
                @click="select(true)"
                class="search-result-button__main">
                All regions in: {{result.title}} ({{result.regions.length}}) Same color
            </div>
            <div
                @click="toggle()"
                class="search-result-button__color">
                <div
                    :style="{'background-color': color}"
                    class="color-swatch"></div>
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