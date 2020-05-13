<script>
    import Region from '@/classes/Region';

    export default {
        name: 'region-visible',
        components: {},
        props: {
            region: {
                type: Region,
                required: true
            }
        },
        computed: {

        },
        methods: {
            toggle() {
                this.$store.commit('regions/updatePropertyOfItem', {item: this.region, property: 'visible', value: !this.region.visible})
            }
        }
    }
</script>


<template>
    <div
        @click="toggle()"
        title="hide"

        class="region-visible">
        <img src="assets/img/tools/eye.svg"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .region-visible {
        cursor: pointer;
        border-right: 1px solid #ddd;
        height: 100%;
        display: flex;
        align-items: center;
        opacity: 0.7;

        img {
            width: 20px;
            display: block;
        }
    }
</style>