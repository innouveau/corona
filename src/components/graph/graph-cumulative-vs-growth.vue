<script>
    import * as d3 from 'd3';
    import logo from "@/components/elements/logo";
    import graphMixin from './graph-mixin';


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

                // prevent zeros
                minCumulativeCases = Math.max(minCumulativeCases, 1);
                minCases = Math.max(minCases, 1);

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
                this.drawRegionDots(country);
            },
            getY(country, d, i) {
                if (this.perCapita) {
                    return d.delta_cases / (country.population / 1000000)
                } else {
                    return d.delta_cases;
                }

            },
            getX(country, d, i) {
                if (this.perCapita) {
                    return d.cases / (country.population / 1000000)
                } else {
                    return d.cases;
                }
            },
            drawRegionLine(country) {
                let line = d3.line()
                    .x((d, i) => { return this.xScale(this.getX(country, d, i)); })
                    .y((d, i) => { return this.yScale(this.getY(country, d, i)); })
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
                let ticksX, ticksY;
                ticksX = Math.round(Math.log(this.maxX)/Math.log(10));
                ticksY = Math.round(Math.log(this.maxY)/Math.log(10));

                this.container = this.main
                    .append("g")
                    .attr("transform", "translate(" + this.settings.margin.left + "," + this.settings.margin.top + ")");

                this.container.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + this.settings.height + ")")
                    .call(d3.axisBottom(this.xScale)
                        .ticks(ticksX)
                        .tickFormat(d3.format(".0s"))
                    );


                this.container.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(this.yScale)
                        .ticks(ticksY)
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
        class="line-chart">
        <div
            ref="container"
            class="line-chart__container">
            <svg fill="#fff">
                <g class="line-chart__content"></g>
            </svg>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';



    .line-chart {
        overflow: hidden;
        position: relative;

        .save-image__container {
            position: absolute;
            right: 10px;
            bottom: 26px;
            padding: 4px 24px 4px 60px;
            z-index: 0;
            background: #fff;
        }
    }
</style>