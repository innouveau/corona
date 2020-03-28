<script>
    export default {
        name: 'graph',
        components: {},
        props: {},
        computed: {
            countries() {
                return this.$store.state.countries.all.filter(c => c.active);
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="graph">
        {{countries}}
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph {
        padding: 20px;
    }
</style>