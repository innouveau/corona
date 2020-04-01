<script>
    export default {
        name: 'credits',
        components: {},
        props: {},
        computed: {},
        methods: {}
    }
</script>


<template>
    <div class="credits">
        <div class="credits__logo">
            <img src="assets/img/datagraver-innouveau.svg"/><br>
            Development by <a href="https://innouveau.com/" target="_blank">Innouveau</a>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .credits {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid #ddd;
        padding-top: 10px;

        .credits__logo {
            text-align: right;
            font-size: 8px;
            color: #555;

            img {
                width: 80px;
            }

            a {
                color: #000;
            }
        }
    }
</style>