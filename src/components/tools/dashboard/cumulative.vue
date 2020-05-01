<script>
    import vSwitch from "@/components/elements/switch";

    export default {
        name: 'cumulative',
        components: {
            vSwitch
        },
        props: {},
        computed: {
            isActive() {
                return this.$store.state.settings.cumulative;
            }
        },
        methods: {
            toggle() {
                this.$store.commit('settings/updateProperty', {
                    key: 'cumulative',
                    value: !this.isActive
                })
            }
        }
    }
</script>


<template>
    <div class="per-capita">
        <v-switch
                :toggle="toggle"
                :is-active="isActive"/>
        Cases/Fatalities cumulative
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .per-capita {
        display: flex;
        align-items: center;
    }
</style>