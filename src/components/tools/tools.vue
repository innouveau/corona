<script>
    import regionPicker from "./regions/region-picker";
    import typePicker from "./types/type-picker";
    import settings from "./settings";
    import dashboard from "./dashboard/dashboard";
    import events from "./events/events";

    export default {
        name: 'tools',
        components: {
            events,
            dashboard,
            settings,
            typePicker,
            regionPicker
        },
        props: {},
        computed: {},
        methods: {}
    }
</script>


<template>
    <div class="tools">
        <div class="tools__section">
            <region-picker/>
            <type-picker/>
        </div>
        <div class="tools__section">
            <settings/>
            <dashboard/>
            <events/>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .tools {
        border-top: 2px solid #aaa;

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



        @include mobile() {

            .tools__section {
                display: block;

                > div {
                    width: 100%;
                    border-right: 0;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
    }
</style>