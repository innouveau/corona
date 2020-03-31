<script>
    import countryPicker from "./countries/country-picker";
    import typePicker from "./types/type-picker";
    import settings from "./settings";
    import dashboard from "./dashboard/dashboard";

    export default {
        name: 'tools',
        components: {
            dashboard,
            settings,
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
            <settings/>
            <dashboard/>
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

                &:last-child {
                    border-right: 0;
                }
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