<script>
    import Error from '@/classes/Error';

    export default {
        name: 'error',
        components: {},
        props: {
            error: {
                type: Error,
                required: true
            }
        },
        computed: {},
        methods: {}
    }
</script>


<template>
    <div class="error">
        <div class="error__icon"></div>
        <div
            v-html="error.message"
            class="error__message">
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .error {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding: 12px 16px;

        .error__icon {
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 18px solid red;
            margin-right: 12px;
            font-weight: 700;
            font-size: 13px;
            position: relative;

            &:after {
                content: '!';
                position: absolute;
                left: 0;
                width: 100%;
                top: 3px;
                display: flex;
                justify-content: center;
                color: #fff;
            }
        }


        .error__message {

        }

        &:last-child {
            border-bottom: 0;
        }
    }
</style>