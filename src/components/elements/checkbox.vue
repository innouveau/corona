<script>
    import inlineSvg from "@/components/elements/inline-svg";

    export default {
        name: 'checkbox',
        components: {
            inlineSvg
        },
        props: {
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
        :class="{'checkbox--active': isActive}"
        class="checkbox">
        <img src="assets/img/tools/checkmark.svg"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .checkbox {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 2px;
        margin-right: 8px;

        img {
            width: 12px;
            height: 12px;
            display: block;
            visibility: hidden;
        }

        &.checkbox--active {

            img {
                visibility: visible;
            }
        }
    }
</style>