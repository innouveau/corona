<script>
    import shareUrlPopup from "./share-url-popup";

    export default {
        name: 'share-url',
        components: {
            shareUrlPopup
        },
        props: {},
        computed: {},
        methods: {}
    }
</script>


<template>
    <div class="share-url">
        Share these settings

<!--        <share-url-popup/>-->
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .share-url {
        position: absolute;
        right: 20px;
        top: 20px;
        border: 1px solid #ddd;
        padding: 4px;
        cursor: pointer;
        border-radius: 3px;

        &:hover {
            background: #ddd;
        }
    }
</style>