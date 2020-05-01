<script>
    import vSwitch from "@/components/elements/switch";

    export default {
        name: 'y-scale',
        components: {
            vSwitch
        },
        props: {},
        computed: {
            isActive() {
                return this.$store.state.settings.logScale;
            }
        },
        methods: {
            toggle() {
                this.$store.commit('settings/updateProperty', {key: 'logScale', value: !this.isActive})
            }
        }
    }
</script>


<template>
    <div class="y-scale">
        <v-switch
            :toggle="toggle"
            :is-active="isActive"/>
        Logarithmic Scale
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .y-scale {
        display: flex;
        align-items: center;
    }
</style>