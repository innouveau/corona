<script>
    export default {
        name: 'share-url-popup',
        components: {},
        props: {},
        computed: {
            countries() {
                return this.$store.state.countries.all.filter(c => c.active);
            },
            url() {
                let countries, string;
                countries = this.countries.map(c => c.title.toLowerCase() + ':' + c.color);
                string = '?countries=' + countries;
                if (this.$store.state.settings.logScale) {
                    string += '&logscale=true';
                }
                if (this.$store.state.settings.perCapita) {
                    string += '&percapita=true';
                }
                if (this.$store.state.settings.cutY) {
                    string += '&cutyaxis=true';
                }
                return string;
            }
        },
        methods: {}
    }
</script>


<template>
    <div class="share-url-popup">
        <div class="share-url-popup__url">
            <a :href="url" target="_blank">{{url}}</a>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .share-url-popup {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;

        .share-url-popup__url {

            a {
                color: #fff;
                font-size: 14px;
            }
        }
    }
</style>