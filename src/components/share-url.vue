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
            Share these settings
        </div>


        <share-url-popup
            v-if="isOpen"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .share-url {
        position: absolute;
        right: 20px;
        top: 20px;

        .share-url__button {
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 3px;
            background: orange;
            color: #fff;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.2);

            &:hover {
                background: #000;
            }
        }
    }
</style>