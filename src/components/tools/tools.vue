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
        <div class="tools__section">
            <country-picker/>
            <type-picker/>
        </div>
        <div class="tools__section">
            <map-tools/>
            <div class="tools__subsection">
                <y-scale/>
                <per-capita/>
            </div>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .tools {

        .tools__section {
            display: flex;
            border-bottom: 2px solid #aaa;

            > div {
                width: 50%;
                border-right: 1px solid #ddd;
            }

            .tools__subsection {
                padding: 20px;
            }
        }

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