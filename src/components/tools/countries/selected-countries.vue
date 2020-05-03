<script>
    import country from "./country";

    export default {
        name: 'selected-countries',
        components: {
            country
        },
        props: {},
        computed: {
            countries() {
                return this.$store.state.countries.all.filter(c => c.active);
            }
        },
        methods: {
            removeAll() {
                for (let country of this.countries) {
                    this.$store.commit('countries/updatePropertyOfItem', {item: country, property: 'active', value: false})
                }
            }
        }
    }
</script>


<template>
    <div class="selected-countries">
        <div class="selected-countries__countries">
            <country
                    v-for="country in countries"
                    :country="country"/>

            <div
                v-if="countries.length > 1"
                @click="removeAll()"
                class="text-button">
                Remove all countries
            </div>
        </div>

        <div>
            <span class="comment">Colors are generated randomly (or set via the url). You can click on the color swatch to change it.</span>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .selected-countries {

        .selected-countries__countries {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 8px;
        }

        .comment {
            color: #aaa;
            font-style: italic;
        }
    }

    .text-button {
        border: 1px solid #ddd;
        padding: 2px 4px;
        height: 24px;
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-left: 4px;
    }
</style>