<script>
    import yScale from "./y-scale";
    import perCapita from "./per-capita";
    import startAtZero from "./start-at-zero";

    export default {
        name: 'dashboard',
        components: {
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
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .dashboard {

    }
</style>