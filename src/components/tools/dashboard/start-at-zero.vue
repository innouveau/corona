<script>
    import vSwitch from "@/components/elements/switch";

    export default {
        name: 'start-at-zero',
        components: {vSwitch},
        props: {},
        computed: {
            isActive() {
                return this.$store.state.settings.cutY;
            }
        },
        methods: {
            toggle() {
                this.$store.commit('settings/updateProperty', {
                    key: 'cutY',
                    value: !this.isActive
                })
            }
        }
    }
</script>


<template>
    <div class="start-at-zero tool">
        <v-switch
                :toggle="toggle"
                :is-active="isActive"/>
        Cut Y axis
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .start-at-zero {
        display: flex;
        align-items: center;
    }
</style>