<script>
    import * as d3 from 'd3';
    import logo from "@/components/elements/logo";
    import graphMixin from './graph-mixin';
    import consts from '@/data/consts';

    export default {
        name: 'line-chart',
        components: {
            logo
        },
        mixins: [graphMixin],
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        computed: {
            xAxisLabel() {
                return '→ Cumulative cases';
            },
            yAxisLabel() {
                return '→ Daily cases';
            },
            title() {
                let string = 'Cumulative cases vs daily cases';
                if (this.perCapita) {
                    string += ' per 1M capita';
                }
                return string;
            },
            smoothened() {
                return true;
                //return this.$store.state.graphSetting === 'Smoothened';
            }
        },
        methods: {
            update() {
                setTimeout(() => {
                    this.clear();
                    this.setWidth();
                    this.draw();
                }, );
            },
            draw() {
                this.setScales();
                this.drawAxes();
                this.drawVisor();
                this.drawTitle();
                this.drawXAxisLabel();
                this.drawYAxisLabel();

                for (let country of this.data) {
                    if (country.dataPoints.length > 0) {
                        this.drawRegion(country);
                    }
                }
                this.repositionLabels();
            },
            setScales() {
                let minCases, minCumulativeCases, maxCases, maxCumulativeCases;
                minCases = null;
                minCumulativeCases = null;
                maxCases = 0;
                maxCumulativeCases = 0;

                for (let country of this.data) {
                    let countryMinCases, countryMinCumulativeCases, countryMaxCases, countryCumulativeCases, lastIndex;
                    lastIndex = country.dataPoints.length - 1;

                    countryMinCases = d3.min(country.dataPoints.map(d => this.getY(country, d, false)));
                    countryMaxCases = d3.max(country.dataPoints.map(d => this.getY(country, d, false)));
                    countryMinCumulativeCases = this.getX(country, country.dataPoints[0], 0);
                    countryCumulativeCases = this.getX(country, country.dataPoints[lastIndex], lastIndex);

                    if (countryMinCases < minCases || minCases === null) {
                        minCases = countryMinCases;
                    }

                    if (countryMinCumulativeCases < minCumulativeCases || minCumulativeCases === null) {
                        minCumulativeCases = countryMinCumulativeCases;
                    }

                    if (countryMaxCases > maxCases) {
                        maxCases = countryMaxCases;
                    }

                    if (countryCumulativeCases > maxCumulativeCases) {
                        maxCumulativeCases = countryCumulativeCases;
                    }
                }

                this.maxX = maxCumulativeCases;
                this.maxY = maxCases;
                this.xScale = d3.scaleLog()
                    .domain([minCumulativeCases, maxCumulativeCases])
                    .range([0, this.settings.width]);

                this.yScale = d3.scaleLog()
                    .domain([minCases, maxCases])
                    .range([this.settings.height, 0]);
            },
            drawRegion(country) {
                this.drawRegionLine(country);
                this.drawRegionLabel(country);
                //this.drawRegionDots(country);
            },
            getY(country, d, i) {
                let value = d.getValue('cases', this.smoothened, '', 'cases');
                if (d.cases === 0) {
                    return consts.virtualZero
                } else {
                    return value;
                }
                // let value;
                // if (this.smoothened) {
                //     value =
                // } else {
                //     value = d.delta_cases;
                // }
                //
                // if (value === 0) {
                //     return consts.virtualZero
                // } else {
                //     if (this.perCapita) {
                //         return value / (country.population / 1000000);
                //     } else {
                //         return value;
                //     }
                // }
            },
            getX(country, d, i) {
                if (d.cases === 0) {
                    return consts.virtualZero
                } else {
                    if (this.perCapita) {
                        return d.cases / (country.population / 1000000)
                    } else {
                        return d.cases;
                    }
                }
            },
            drawRegionLine(country) {
                let line = d3.line()
                    .x((d, i) => {
                        return this.xScale(this.getX(country, d, i));
                    })
                    .y((d, i) => {
                        return this.yScale(this.getY(country, d, i));
                    })
                    .curve(d3.curveMonotoneX);

                this.linesLayer.append("path")
                    .datum(country.dataPoints)
                    .attr("class", "line line--raw")
                    .attr("stroke", () => {
                        if (country.visible) {
                            return country.color;
                        } else {
                            return 'transparent';
                        }
                    })
                    .style('fill', 'transparent')
                    .attr("d", line)
                    .attr('stroke-width', 1);
            },
            drawAxes() {
                let numberOfTicksX, numberOfTicksY;
                numberOfTicksX = Math.round(Math.log(this.maxX)/Math.log(10));
                numberOfTicksY = Math.round(Math.log(this.maxY)/Math.log(10));
                this.container = this.main
                    .append("g")
                    .attr("transform", "translate(" + this.settings.margin.left + "," + this.settings.margin.top + ")");

                this.container.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + this.settings.height + ")")
                    .call(d3.axisBottom(this.xScale)
                        .ticks(numberOfTicksX)
                        .tickFormat(d3.format(".0s"))
                    );


                this.container.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(this.yScale)
                        .ticks(numberOfTicksY)
                        .tickFormat(d3.format(".0s"))
                    );

                this.linesLayer = this.container.append('g')
                    .attr('class', 'lines');

                this.eventsLayer = this.container.append('g')
                    .attr('class', 'events');

            }
        },
        mounted() {
            this.drawTooltip();
            this.init();
            this.update();
        },

    }
</script>


<template>
    <div
        :style="{'width': (100 / $parent.l) + '%'}"
        class="line-chart line-chart--graph-cumulative-vs-growth">
        <div
            ref="container"
            class="line-chart__container">
            <svg fill="#fff">
                <g class="line-chart__content"></g>
                <g class="line-chart__logo">
                    <logo v-if="showLogo"/>
                </g>
            </svg>
        </div>
        <div class="save-image__container">
            <div
                    @click="saveImage()"
                    class="save-image">
                <div class="save-image__icon">
                    <img src="assets/img/tools/screenshot.svg">
                </div>
                <div class="save-image__label">
                    Save image
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .line-chart--graph-cumulative-vs-growth {

        .dot {

            circle {

                &.dot__visbile-area {
                    stroke: transparent!important;
                }
            }
        }
    }

</style>