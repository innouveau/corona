<script>
    export default {
        name: 'explanation-chapter',
        components: {},
        props: {
            chapter: {
                type: Object,
                required: true
            }
        },
        computed: {},
        methods: {}
    }
</script>


<template>
    <div class="explanation-chapter">
        <h2>
            {{chapter.title}}
        </h2>
        <div
            v-html="chapter.description"
            class="explanation-chapter__description"></div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .explanation-chapter {
        width: 500px;
        max-width: 100%;
    }
</style>