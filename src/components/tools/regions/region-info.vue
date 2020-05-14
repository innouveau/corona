<script>
    export default {
        name: 'region-info',
        components: {},
        props: {},
        computed: {
            region() {
                return this.$store.state.ui.currentRegion;
            },
            totalCases() {
                return this.region.lastEntry.cases;
            },
            casesPct() {
                return (100 * (this.totalCases / this.region.population)).toFixed(1) + '%';
            },
            totalFatalities() {
                return this.region.lastEntry.fatalities;
            },
            fatalitiesPct() {
                return (100 * (this.totalFatalities / this.region.population)).toFixed(1) + '%';
            },
            cfr() {
                return (100 * (this.totalFatalities / this.totalCases)).toFixed(1) + '%';
            },
            firstCase() {
                let first = this.region.entries.find(e => e.cases > 0);
                if (first) {
                    return first.date;
                } else {
                    return '-';
                }
            },
            firstFatality() {
                let first = this.region.entries.find(e => e.fatalities > 0);
                if (first) {
                    return first.date;
                } else {
                    return '-';
                }
            }
        },
        methods: {
            close() {
                this.$store.commit('ui/updateProperty', {key: 'currentRegion', value: null})
            }
        }
    }
</script>


<template>
    <div class="region-info">
        <div class="region-info__header">
            <div class="region-info__title">
                {{region.title}}
            </div>
            <div
                @click="close()"
                class="close-button">×</div>
        </div>

        <div class="region-info__body">
            <div class="region-info__section">
                <div class="region-info__row">
                    <div class="region-info__label">
                        Population
                    </div>
                    <div class="region-info__value">
                        {{region.populationString}}
                    </div>
                </div>
                <div class="region-info__row">
                    <div class="region-info__label">
                        Part of
                    </div>
                    <div class="region-info__value">
                        {{region.parent.title}}
                    </div>
                </div>
            </div>
            <div class="region-info__section">
                <div class="region-info__row">
                    <div class="region-info__label">
                        First case
                    </div>
                    <div class="region-info__value">
                        {{firstCase}}
                    </div>
                </div>
                <div class="region-info__row">
                    <div class="region-info__label">
                        Total cases
                    </div>
                    <div class="region-info__value">
                        {{totalCases}} ({{casesPct}})
                    </div>
                </div>
            </div>
            <div class="region-info__section">
                <div class="region-info__row">
                    <div class="region-info__label">
                        First fatality
                    </div>
                    <div class="region-info__value">
                        {{firstFatality}}
                    </div>
                </div>
                <div class="region-info__row">
                    <div class="region-info__label">
                        Total fatalities
                    </div>
                    <div class="region-info__value">
                        {{totalFatalities}} ({{fatalitiesPct}})
                    </div>
                </div>
                <div class="region-info__row">
                    <div class="region-info__label">
                        Case Fatality Rate
                    </div>
                    <div class="region-info__value">
                        {{cfr}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .region-info {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        width: 600px;
        max-width: 100%;
        background: #fff;
        box-shadow: 2px 4px 12px rgba(0,0,0,0.2);

        .region-info__header {
            padding: 20px;
            border-bottom: 1px solid #ddd;
            font-size: 16px;
            font-family: 'Merriweather';
            position: relative;

            .close-button {
                color: #000;
                background: #ddd;
                top: 50%;
                transform: translateY(-50%);

                &:hover {
                    border: 1px solid #000;
                }
            }
        }

        .region-info__body {

            .region-info__section {
                padding: 0 20px;
                border-bottom: 2px solid #aaa;

                .region-info__row {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #ddd;

                    .region-info__label {
                        width: 150px;
                        font-weight: 700;
                    }

                    .region-info__value {

                    }

                    &:last-child {
                        border-bottom: 0;
                    }
                }

                &:last-child {
                    border-bottom: 0;
                }
            }
        }
    }
</style>