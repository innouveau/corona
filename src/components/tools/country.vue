<script>
    import Country from '@/classes/Country';
    import checkbox from "../elements/checkbox";

    export default {
        name: 'country',
        components: {
            checkbox,
        },
        props: {
            country: {
                type: Country,
                required: true
            }
        },
        computed: {
            isActive() {
                return this.country.active;
            }
        },
        methods: {
            toggle() {
                this.$store.commit('countries/updatePropertyOfItem', {item: this.country, property: 'active', value: !this.country.active})
            }
        }
    }
</script>


<template>
    <div
        @click="toggle()"
        class="country">
        <checkbox
            :is-active="isActive"/>
        <div
            :style="{'background-color': country.color}"
            class="country__bullet"></div>
        <div class="country__title">
            {{country.title}}
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .country {
        display: flex;
        align-items: center;
        padding: 4px;
        border-bottom: 1px solid #ddd;
        cursor: pointer;

        .country__bullet {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 4px;
        }
    }
</style>