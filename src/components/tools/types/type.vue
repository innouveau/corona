<script>
    import Type from '@/classes/Type';
    import checkbox from "@/components/elements/checkbox";

    export default {
        name: 'type',
        components: {
            checkbox
        },
        props: {
            type: {
                type: Type,
                required: true
            }
        },
        computed: {
            isActive() {
                return this.type.active;
            }
        },
        methods: {
            toggle() {
                this.$store.commit('types/updatePropertyOfItem', {item: this.type, property: 'active', value: !this.type.active})
            }
        }
    }
</script>


<template>
    <div
        @click="toggle()"
        class="type">
        <checkbox
            :is-active="isActive"/>
        <div class="type__title">
            {{type.title}}
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .type {
        display: flex;
        align-items: center;
        padding: 4px;
        cursor: pointer;
        margin-right: 10px;
    }
</style>