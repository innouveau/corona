<script>
    import * as d3 from "d3";
    import loader from '@/tools/loader';

    export default {
        name: 'updated-at',
        components: {},
        props: {},
        data() {
            return {
                updatedAt: ''
            }
        },
        computed: {},
        methods: {
            init() {
                let url = window.config.repo + 'updated_at.csv' + loader.getTimestamp();
                d3.csv(url).then((result) => {
                    if (result && result.columns && result.columns.length > 0) {
                        this.updatedAt = result.columns[0];
                    }
                })
            }
        },
        mounted() {
            this.init();
        }
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