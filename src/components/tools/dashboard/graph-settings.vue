<script>
    import vSelect from 'vue-select';

    export default {
        name: 'graph-settings',
        components: {
            vSelect
        },
        props: {},
        data(){
            return {
                graphSettingOptions: [
                    'Raw data',
                    'Smoothened',
                    'Both'
                ]
            }
        },
        computed: {
            graphSetting: {
                set(value) {
                    this.$store.commit('settings/updateProperty', {key: 'graphSetting', value})
                },
                get() {
                    return this.$store.state.settings.graphSetting;
                }
            },
        },
        methods: {}
    }
</script>


<template>
    <div class="graph-settings">
        <v-select
            v-model="graphSetting"
            :options="graphSettingOptions"
            :clearable="false"/>

        <div
            v-if="graphSetting === graphSettingOptions[1]"
            class="graph-settings__comment">
            * y-position dot (smoothened) does not match value (raw)
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-settings {
        display: flex;
        align-items: center;

        .graph-settings__comment {
            font-style: italic;
            color: #888;
        }
    }
</style>