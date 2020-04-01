<script>
    import Country from '@/classes/Country';

    export default {
        name: 'country-visible',
        components: {},
        props: {
            country: {
                type: Country,
                required: true
            }
        },
        computed: {

        },
        methods: {
            toggle() {
                this.$store.commit('countries/updatePropertyOfItem', {item: this.country, property: 'visible', value: !this.country.visible})
            }
        }
    }
</script>


<template>
    <div
        @click="toggle()"
        title="hide"

        class="country-visible">
        <img src="assets/img/tools/eye.svg"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .country-visible {
        margin-right: 8px;
        cursor: pointer;
        border-right: 1px solid #ddd;
        height: 100%;
        display: flex;
        align-items: center;
        opacity: 0.7;

        img {
            width: 20px;
            display: block;
        }
    }
</style>