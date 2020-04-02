<script>
    import Country from '@/classes/Country';
    import countryColor from "./country-color";
    import CountryVisible from "./country-visible";

    export default {
        name: 'country',
        components: {
            CountryVisible,
            countryColor
        },
        props: {
            country: {
                type: Country,
                required: true
            }
        },
        computed: {
            isVisible() {
                return this.country.visible;
            }
        },
        methods: {
            deleteCountry() {
                this.$store.commit('countries/updatePropertyOfItem', {item: this.country, property: 'active', value: false})
            }
        }
    }
</script>


<template>
    <div
        :class="{'country--visible': isVisible}"
        :style="{'border-bottom': '3px solid ' + country.color}"
        class="country">
        <country-visible
            :country="country"/>
        <country-color
            :country="country"/>
        <div class="country__title">
            {{country.title}}
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
        box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        margin: 0 12px 8px 0;
        opacity: 0.3;
        transition: opacity 0.2s ease;
        background: #eee;

        .country__title {
            padding: 2px 6px;
            border-right: 1px solid #ddd;
            height: 100%;
        }

        .country__remove {
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

        &.country--visible {
            opacity: 1;
        }
    }
</style>