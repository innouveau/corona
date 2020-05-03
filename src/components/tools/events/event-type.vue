<script>
    import checkbox from "@/components/elements/checkbox";
    import EventType from "@/classes/EventType";

    export default {
        name: 'event-type',
        components: {
            checkbox
        },
        props: {
            eventType: {
                type: EventType,
                required: true
            }
        },
        computed: {
            tag() {
                return this.eventType.tag;
            },
            isActive() {
                return this.$store.state.settings.eventTypes.indexOf(this.tag) > -1;
            }
        },
        methods: {
            toggle() {
                this.$store.commit('settings/toggleEventType', this.tag)
            }
        }
    }
</script>


<template>
    <div
        @click="toggle()"
        class="event-type">
        <checkbox
            :is-active="isActive"/>
        <div class="event-type__title">
            {{eventType.title}}
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .event-type {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        cursor: pointer;

        .event-type__title {
            text-transform: capitalize;
        }
    }
</style>