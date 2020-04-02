<script>
    export default {
        name: 'updated-at',
        components: {},
        props: {},
        computed: {
            updatedAt() {
                return this.$store.state.ui.updatedAt;
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="updated-at">
        Updated at {{updatedAt}}
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .updated-at {
        text-align: right;
        font-size: 8px;
        color: #555;
        margin-bottom: 10px;
    }
</style>