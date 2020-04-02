<script>
    import Country from '@/classes/Country';
    import { Swatches } from 'vue-color';

    export default {
        name: 'country-color',
        components: {
            'swatches-picker': Swatches
        },
        props: {
            country: {
                type: Country,
                required: true
            }
        },
        data() {
            return {
                isOpen: false,
                color: this.country.color
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
                this.country.color = this.color.hex;
            }
        }
    }
</script>


<template>
    <div
        @click="toggle()"

        class="country-color">

        <div
            :style="{'background-color': country.color}"
            class="country-color__swatch">

        </div>
        <swatches-picker
            v-if="isOpen"
            v-model="color" />
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .country-color {
        padding: 4px;
        display: flex;
        align-items: center;
        cursor: pointer;
        border-right: 1px solid #ddd;
        position: relative;

        .country-color__swatch {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }

        .vc-swatches {
            z-index: 100;
            position: absolute;
            top: 0;
        }
    }
</style>