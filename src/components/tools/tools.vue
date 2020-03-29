<script>
    import countryPicker from "./country-picker";
    import typePicker from "./type-picker";
    import mapTools from "./map-tools";
    import yScale from "./y-scale";
    import PerCapita from "./per-capita";

    export default {
        name: 'tools',
        components: {
            PerCapita,
            yScale,
            mapTools,
            typePicker,
            countryPicker
        },
        props: {},
        computed: {},
        methods: {}
    }
</script>


<template>
    <div class="tools">
        <country-picker/>
        <type-picker/>
        <map-tools/>
        <y-scale/>
        <per-capita/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .tools {

        .tools__row {
            display: flex;
            align-items: center;
            margin-bottom: 4px;

            .tools__label {
                width: 80px;
            }

            input {
                background: #ddd;
                padding: 6px;
                border: 0;
            }
        }
    }
</style>