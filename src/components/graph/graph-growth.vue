<script>
    import lineChart from "./line-chart";

    export default {
        name: 'graph-growth',
        components: {
            lineChart
        },
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        computed: {
            growthRatePer() {
                return this.$store.state.settings.growthRatePer;
            }
        },
        methods: {
            getValue(country, d) {
                let index, days, value;

                const findIndex = function(d) {
                    for (let entry of country.originalDataPoints) {
                        if (entry.date === d.date) {
                            return country.originalDataPoints.indexOf(entry);
                        }
                    }
                    return -1;
                };

                index = findIndex(d);
                days = this.growthRatePer;
                if (index > (days - 1)) {
                    let prev, ratio;
                    prev = country.originalDataPoints[index - days];
                    ratio = d.fatalities / prev.fatalities;
                    value = Math.pow(ratio, (1/days));
                    return Math.round(value * 100) / 100;
                } else {
                    return null;
                }
            }
        }
    }
</script>


<template>
    <div
        class="graph-growth"
        :style="{'width': (100 / $parent.l) + '%'}">
        <h2>
            Growth
        </h2>
        <line-chart
            :data="data"
            :get-value="getValue"
            :apply-log-scale="false"/>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-growth {

    }
</style>