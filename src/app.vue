<script>
    import tools from "./components/tools/tools";
    import store from '@/store/store';
    import graphs from "./components/graph/graphs";

    export default {
        name: 'app',
        components: {
            graphs,
            tools
        },
        props: {},
        computed: {
            dataLoaded() {
                return this.$store.state.dataLoaded;
            }
        },
        methods: {},
        mounted() {
            this.$store.commit('countries/init', window.data.countries);
            this.$store.commit('types/init', window.data.types);
            this.$store.commit('updateProperty', {key: 'dataLoaded', value: true});
        }
    }
</script>


<template>
    <div class="app">
        <tools/>
        <graphs
            v-if="dataLoaded"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .app {

    }
</style>