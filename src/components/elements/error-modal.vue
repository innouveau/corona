<script>
    import error from './error';

    export default {
        name: 'error-modal',
        components: {
            error
        },
        props: {},
        computed: {
            errors() {
                return this.$store.state.errorModal.errors;
            }
        },
        methods: {
            close() {
                this.$store.commit('errorModal/close');
            }
        }
    }
</script>


<template>
    <div class="error-modal">
        <div class="error-modal__body">
            <error
                v-for="error in errors"
                :error="error"/>
        </div>

        <div
            @click="close()"
            class="modal__close"></div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .error-modal {
        background-color: #fff;
        position: absolute;
        width: 500px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        top: 60px;
        transition: top 1s ease;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.40);
        padding-top: 30px;

        .error-modal__body {
            padding: 12px 0;
        }

        .modal__close {
            position: absolute;
            right: 1rem;
            top: 1rem;
            cursor: pointer;
            width: 24px;
            height: 24px;
            opacity: 0.8;
            text-align: center;
            border: 1px solid rgba(0, 0, 0,0.4);
            border-radius: 3px;

            &:before, &:after {
                position: absolute;
                left: 11px;
                top: 2px;
                content: ' ';
                height: 18px;
                width: 1px;
                background-color: #000;
            }

            &:before {
                transform: rotate(45deg);
            }
            &:after {
                transform: rotate(-45deg);
            }

            &:hover {
                opacity: 1;
            }
        }
    }
</style>