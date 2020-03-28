<script>
    import inlineSvg from "@/components/elements/inline-svg";

    export default {
        name: 'checkbox',
        components: {
            inlineSvg
        },
        props: {
            toggle: {
                type: Function,
                required: true
            },
            isActive: {
                type: Boolean,
                required: true
            }
        },
        computed: {},
        methods: {}
    }
</script>


<template>
    <div
        @click="toggle()"
        :class="{'checkbox--active': isActive}"
        class="checkbox">
        <inline-svg :src="'assets/img/tools/checkmark.svg'"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .checkbox {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 2px;
        cursor: pointer;
        margin-right: 8px;

        svg {
            width: 12px;
            height: 12px;
            visibility: hidden;
        }

        &.checkbox--active {

            svg {
                visibility: visible;
            }
        }
    }
</style>