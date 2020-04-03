<script>
    export default {
        name: 'share-url-popup',
        components: {},
        props: {},
        data() {
            return {
                description: this.$store.state.ui.description
            }
        },
        computed: {
            countries() {
                return this.$store.state.countries.all.filter(c => c.active);
            },
            url() {
                let countries, string;
                countries = this.countries.map(c => {
                    let string = c.title.toLowerCase() + ':';
                    // cannot pass the # via the url
                    if (c.color[0] === '#') {
                        string += 'hex' + c.color.substring(1);
                    } else {
                        string += c.color;
                    }
                    return string;
                });
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
                string += '&startat=' + this.$store.state.settings.startAt;
                string += '&stopat=' + this.$store.state.settings.stopAt;
                string += '&growthaverage=' + this.$store.state.settings.growthRatePer;
                string += '&startattype=' + this.$store.state.settings.mappingType;
                string += '&startatstyle=' + this.$store.state.settings.startAtStyle;
                if (this.description && this.description.length > 0) {
                    string += '&description=' + encodeURIComponent(this.description);
                }
                return window.location.origin + window.location.pathname + '#/' + string;
            }
        },
        methods: {
            close() {
                this.$store.commit('ui/updateProperty', {key: 'shareUrlPopup', value: false});
            }
        }
    }
</script>


<template>
    <div class="share-url-popup">
        <div class="share-url-popup__content">
            <div class="share-url-popup__title">
                <h3>
                    You can add a title to the page if you want.
                </h3>
                <input v-model="description"/>
            </div>

            <div class="share-url-popup__url">
                <input v-model="url"/><br><br>
                <a :href="url" target="_blank">Try the link</a>
            </div>
        </div>


        <div
            @click="close()"
            class="share-url-popup__close">
            ×
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

        .share-url-popup__content {
            color: #fff;
            text-align: center;
            width: 100%;

            .share-url-popup__title {
                margin-bottom: 40px;

                input {
                    width: 300px;
                }
            }

            .share-url-popup__url {
                text-align: center;
                background: orange;
                padding: 20px;
                width: 340px;
                margin: 0 auto;

                input {
                    background: #fff;
                    padding: 8px;
                    width: 300px;
                    max-width: 100%;
                }

                a {
                    color: #000;
                    font-size: 14px;
                }
            }
        }



        .share-url-popup__close {
            position: absolute;
            right: 20px;
            top: 20px;
            font-size: 32px;
            color: #fff;
            padding: 4px;
            cursor: pointer;
            border: 1px solid transparent;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;

            &:hover {
                border: 1px solid #fff;
            }
        }
    }
</style>