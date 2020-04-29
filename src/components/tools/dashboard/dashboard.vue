<script>
    import yScale from "./y-scale";
    import perCapita from "./per-capita";
    import startAtZero from "./start-at-zero";
    import cumulative from "./cumulative";

    export default {
        name: 'dashboard',
        components: {
            cumulative,
            startAtZero,
            perCapita,
            yScale
        },
        props: {},
        computed: {},
        methods: {}
    }
</script>


<template>
    <div class="dashboard">
        <y-scale/>
        <per-capita/>
        <start-at-zero/>
        <cumulative/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .dashboard {

    }
</style>