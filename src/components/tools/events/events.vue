<script>
    import vSwitch from "@/components/elements/switch";
    import eventType from "./event-type";

    export default {
        name: 'events',
        components: {
            eventType,
            vSwitch
        },
        props: {},
        computed: {
            isActive() {
                return this.$store.state.settings.showEvents;
            },
            eventTypes() {
                return this.$store.state.eventTypes.all;
            }
        },
        methods: {
            toggle() {
                this.$store.commit('settings/updateProperty', {
                    key: 'showEvents',
                    value: !this.isActive
                })
            }
        }
    }
</script>


<template>
    <div class="events tool">
        <div class="events__toggle">
            <v-switch
                    :toggle="toggle"
                    :is-active="isActive"/>
            Show Events
        </div>
        <div
            :class="{'event__types--inactive': !isActive}"
            class="event__types">
            <event-type
                v-for="eventType in eventTypes"
                :event-type="eventType"/>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .events {

        .events__toggle {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }

        .event__types {

            &.event__types--inactive {
                opacity: 0.2;
                pointer-events: none;
            }
        }
    }
</style>