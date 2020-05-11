<script>
    import explanationChapter from "./explanation-chapter";

    export default {
        name: 'explanation',
        components: {
            explanationChapter
        },
        props: {},
        computed: {
            currentChapter() {
                return this.$store.state.explanation.current;
            },
            actionLabel() {
                return this.currentChapter.actionLabel();
            },
            hasNextChapter() {
                return this.index < (this.$store.state.explanation.all.length - 1)
            },
            index() {
                return this.$store.state.explanation.all.indexOf(this.currentChapter);
            }
        },
        methods: {
            next() {
                let next = this.$store.state.explanation.all[this.index + 1];
                this.currentChapter.action(this.$store);
                this.$store.commit('explanation/setCurrent', next);
            }
        }
    }
</script>


<template>
    <div class="explanation">
        <explanation-chapter
            v-if="currentChapter"
            :chapter="currentChapter"/>
        <div class="explanation__tools">
            <div
                v-if="currentChapter && hasNextChapter"
                @click="next()"
                class="explanation__button">
                {{actionLabel}}
            </div>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .explanation {
        padding: 8px;
        background: #a1e3db;
        border-bottom: 2px solid #aaa;
        font-size: 13px;

        .explanation__tools {
            margin-top: 20px;
            display: flex;

            .explanation__button {
                padding: 8px;
                border: 1px solid #000;
                color: #000;
                cursor: pointer;
                background: #fff;
            }
        }
    }
</style>