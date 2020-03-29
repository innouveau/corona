<script>
    import type from "./type";

    export default {
        name: 'type-picker',
        components: {
            type
        },
        props: {},
        computed: {
            types (){
                return this.$store.state.types.all;
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="type-picker tools__subsection">
        <type
            v-for="type in types"
            :type="type"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .type-picker {
        padding: 20px;
    }
</style>