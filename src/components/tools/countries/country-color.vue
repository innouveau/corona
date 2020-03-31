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
        :style="{'background-color': country.color}"
        class="country-color">
        <swatches-picker
            v-if="isOpen"
            v-model="color" />
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .country-color {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 4px;
        cursor: pointer;
    }
</style>