<script>
    import tools from "./components/tools/tools";
    import store from '@/store/store';
    import graph from "./components/graph/graph";

    export default {
        name: 'app',
        components: {
            graph,
            tools
        },
        props: {},
        computed: {},
        methods: {},
        mounted() {
            this.$store.commit('countries/init', window.data.countries);
            this.$store.commit('types/init', window.data.types);
        }
    }
</script>


<template>
    <div class="app">
        <tools/>
        <graph/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .app {

    }
</style>