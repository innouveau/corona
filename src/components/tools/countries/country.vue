<script>
    import Country from '@/classes/Country';
    import countryColor from "./country-color";

    export default {
        name: 'country',
        components: {
            countryColor
        },
        props: {
            country: {
                type: Country,
                required: true
            }
        },
        computed: {},
        methods: {
            deleteCountry() {
                this.$store.commit('countries/updatePropertyOfItem', {item: this.country, property: 'active', value: false})
            }
        }
    }
</script>


<template>
    <div class="country">
        <country-color
            :country="country"/>
        <div class="country__title">
            {{country.title}} ({{country.id}})
        </div>
        <div
            @click="deleteCountry()"
            class="country__remove">×</div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .country {
        display: flex;
        align-items: center;
        padding: 6px;
        box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
        margin-right: 4px;

        .country__title {
            margin-right: 4px;
        }

        .country__remove {
            cursor: pointer;
            background: #000;
            color: #fff;
            width: 12px;
            height: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;

            &:hover {
                background: red;
            }
        }
    }
</style>