<script>
    export default {
        name: 'description',
        components: {},
        props: {},
        computed: {
            description() {
                return this.$store.state.ui.description;
            }
        },
        methods: {}
    }
</script>


<template>
    <div
        v-html="description"
        class="description"></div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .description {
        font-family: Merriweather;
        font-weight: 400;
        font-size: 24px;
        line-height: 1;
        padding: 20px 0;
        margin-left: 70px;
    }
</style>