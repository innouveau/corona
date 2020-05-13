<script>
    import Region from '@/classes/Region';
    import { Swatches } from 'vue-color';

    export default {
        name: 'region-color',
        components: {
            'swatches-picker': Swatches
        },
        props: {
            region: {
                type: Region,
                required: true
            }
        },
        data() {
            return {
                isOpen: false,
                color: this.region.color
            }
        },
        computed: {},
        methods: {
            toggle() {
                this.isOpen = !this.isOpen;
            }
        },
        watch: {
            color() {
                this.region.color = this.color.hex;
            }
        }
    }
</script>


<template>
    <div
        @click="toggle()"

        class="region-color">

        <div
            :style="{'background-color': region.color}"
            class="color-swatch">
        </div>
        <swatches-picker
            v-if="isOpen"
            v-model="color" />
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .region-color {
        padding: 4px;
        display: flex;
        align-items: center;
        cursor: pointer;
        border-right: 1px solid #ddd;
        position: relative;


        .vc-swatches {
            z-index: 100;
            position: absolute;
            top: 0;
        }

        @include mobile() {

            .vc-swatches {
                position: fixed;
                left: 10px;
                top: 10px;
                width: calc(100% - 20px);
            }
        }
    }

    .color-swatch {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
</style>