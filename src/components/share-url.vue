<script>
    import shareUrlPopup from "./share-url-popup";

    export default {
        name: 'share-url',
        components: {
            shareUrlPopup
        },
        props: {},
        computed: {
            isOpen() {
                return this.$store.state.ui.shareUrlPopup;
            }
        },
        methods: {
            open() {
                this.$store.commit('ui/updateProperty', {key: 'shareUrlPopup', value: true});
            }
        }
    }
</script>


<template>
    <div class="share-url">
        <div
            @click="open()"
            class="share-url__button">
            <img src="assets/img/tools/share.svg"/>
            <div class="share-url__text">
                Share these settings
            </div>
        </div>


        <share-url-popup
            v-if="isOpen"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .share-url {


        .share-url__button {
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 3px;
            background: orange;
            color: #fff;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;

            img {
                width: 16px;
                margin-right: 6px;
                display: block;
            }

            &:hover {
                background: #000;
            }
        }

        @include mobile() {
            right: 8px;
            top: 8px;

            .share-url__button {
                height: 32px;

                .share-url__text {
                    display: none;
                }
            }
        }
    }
</style>