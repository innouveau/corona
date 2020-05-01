<script>
    import vSwitch from "@/components/elements/switch";

    export default {
        name: 'per-capita',
        components: {
            vSwitch
        },
        props: {},
        computed: {
            isActive() {
                return this.$store.state.settings.perCapita;
            }
        },
        methods: {
            toggle() {
                this.$store.commit('settings/updateProperty', {
                    key: 'perCapita',
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
        Per (1 million) Capita
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .per-capita {
        display: flex;
        align-items: center;
    }
</style>