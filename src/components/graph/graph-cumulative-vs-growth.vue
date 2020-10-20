<script>
    import * as d3 from 'd3';
    import $ from 'jquery';
    import saveSVGmodule from 'save-svg-as-png';
    import consts from '@/data/consts';
    import logo from "@/components/elements/logo";


    export default {
        name: 'graph-cumulative-vs-growth',
        components: {
            logo
        },
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        data() {
            let margin = {top: 80, right: 70, bottom: 90, left: 50};
            return {
                settings: {
                    margin,
                    width: 0,
                    height: 600 - margin.top - margin.bottom
                },
                showLogo: true,
                svg: null,
                main: null,
                logo: null,
                container: null,
                linesLayer: null,
                eventsLayer: null,
                xScale: null,
                yScale: null,
                tooltip: null,
                eventInfo: null,
                visorX: null,
                visorY: null,
                max: 0
            }
        },
        computed: {
            countries() {
                return this.$store.state.regions.all;
            },
            mapping() {
                return this.$store.state.settings;
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
            clear() {
                if (this.main) {
                    this.main.selectAll('*').remove();
                }
            },
            setWidth() {
                let x, y, width, height;
                this.settings.width = this.$refs.container.offsetWidth - this.settings.margin.left - this.settings.margin.right;
                width = this.settings.width + this.settings.margin.left + this.settings.margin.right;
                height = this.settings.height + this.settings.margin.top + this.settings.margin.bottom;
                x = width - 100;
                y = height - 60;
                this.svg
                    .attr("width", width)
                    .attr("height", height);
            },
            draw() {
                let minCases, minCumulativeCases, maxCases, maxCumulativeCases;
                minCases = null;
                minCumulativeCases = null;
                maxCases = 0;
                maxCumulativeCases = 0;

                for (let country of this.data) {
                    let countryMinCases, countryMinCumulativeCases, countryMaxCases, countryCumulativeCases;

                    countryMinCases = d3.min(country.dataPoints.map(d => d.delta_cases));
                    countryMaxCases = d3.max(country.dataPoints.map(d => d.delta_cases));
                    countryMinCumulativeCases = country.dataPoints[0].cases;
                    countryCumulativeCases = country.dataPoints[country.dataPoints.length - 1].cases;

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



                this.drawAxes();
                for (let country of this.data) {
                    if (country.dataPoints.length > 0) {
                        this.drawRegion(country);
                    }
                }
            },
            getX(country) {
                return 10;
            },
            getY(country) {
                return 10;
            },
            drawXAxisLabel() {
                // this.main.append('g')
                //     .attr('class', 'x-axis-label')
                //     .attr('transform', 'translate(' + this.settings.margin.left + ',' + (this.settings.height + this.settings.margin.top + 40) + ')')
                //     .append('text')
                //     .text(this.xAxisLabel)
                //     .style('font-size', '9px')
                //     .attr('fill', '#888')
                //     .style('font-family', 'Montserrat, sans-serif');
            },
            drawTitle() {
                // this.main.append('g')
                //     .attr('class', 'title')
                //     .attr('transform', 'translate(' + this.settings.margin.left + ', 50)')
                //     .append('text')
                //     .text(this.title)
                //     .style('font-size', '16px')
                //     .style('font-weight', '700')
                //     .attr('fill', '#000')
                //     .style('font-family', 'Montserrat, sans-serif');
            },
            repositionLabels() {
                // let countries, lastY, margin, x;
                // margin = 6;
                // lastY = null;
                // countries = this.data.filter(country => {
                //     return country.dataPoints.length > 0;
                // }).map(country => {
                //     let lastPoint = country.dataPoints[country.dataPoints.length - 1];
                //     return {
                //         country,
                //         lastPointValue: this.yScale(this.getValue(country, lastPoint, true)) + 2
                //     }
                // });
                //
                // countries = countries.sort((a, b) => {
                //     if ( a.lastPointValue < b.lastPointValue ){
                //         return 1;
                //     }
                //     if ( a.lastPointValue > b.lastPointValue ){
                //         return -1;
                //     }
                //     return 0;
                // });
                // for (let item of countries) {
                //     let label = this.main.select('.country-label--' + item.country.id);
                //     if (lastY !== null && item.lastPointValue > (lastY - margin)) {
                //         lastY -= margin;
                //     } else {
                //         lastY = item.lastPointValue;
                //     }
                //     x = this.xScale(item.country.dataPoints.length - 1) + 6;
                //     label.attr('transform', 'translate(' + x + ',' + lastY + ')');
                // }

            },
            drawVisor() {
                // this.visorX = this.container.append('line')
                //     .attr('class', 'visor visor-x')
                //     .attr('stroke-dasharray', '2,2')
                //     .attr('x1', 10)
                //     .attr('y1', 0)
                //     .attr('x2', 10)
                //     .attr('y2', this.settings.height)
                //     .attr('visibility', 'hidden');
                //
                // this.visorY = this.container.append('line')
                //     .attr('class', 'visor visor-y')
                //     .attr('stroke-dasharray', '2,2')
                //     .attr('x1', 0)
                //     .attr('y1', 10)
                //     .attr('x2', this.settings.width)
                //     .attr('y2', 10)
                //     .attr('visibility', 'hidden');
            },
            drawRegion(country) {
                this.drawRegionLine(country);
                //this.drawRegionLabel(country);
            },
            // getIndexByDate(date, dataPoints) {
            //     let index = 0;
            //     for (let dataPoint of dataPoints) {
            //         if (dataPoint.date === date) {
            //             return index;
            //         }
            //         index ++;
            //     }
            //     return -1;
            // },
            getCases(country, d, i) {
                return d.delta_cases;
            },
            getCumulativeCases(country, d, i) {
                return d.cases;
            },
            drawRegionLine(country) {
                let line = d3.line()
                    .x((d, i) => { return this.xScale(this.getCumulativeCases(country, d, i)); })
                    .y((d, i) => { return this.yScale(this.getCases(country, d, i)); })
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
            drawRegionLabel(country) {
                // let dataset, lastPoint, x, y;
                //
                // dataset = country.dataPoints;
                // lastPoint = dataset[dataset.length - 1];
                // x = this.xScale(dataset.length - 1) + 6;
                // y = this.yScale(this.getValue(country, lastPoint, true)) + 2;
                // this.linesLayer.append("g")
                //     .attr("class", "country-label country-label--" + country.id)
                //     .attr('transform', 'translate(' + x + ',' + y + ')')
                //     .attr('fill', () => {
                //         if (country.visible) {
                //             return country.color;
                //         } else {
                //             return 'transparent';
                //         }
                //     })
                //     .style('font-size', '8px')
                //     .style('font-family', 'Montserrat, sans-serif')
                //     .append('text')
                //     .text(country.title)
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

            },
            init() {
                this.svg = d3.select(this.$refs.container).select('svg');
                this.main = this.svg.select('.graph-cumulative-vs-growth__content');
            }
        },
        mounted() {
            this.init();
            this.update();
        },
        watch: {
            countries:  {
                handler: function(newValue) {
                    this.update();
                },
                deep: true
            },
            mapping:  {
                handler: function(newValue) {
                    this.update();
                },
                deep: true
            }
        }
    }
</script>


<template>
    <div
        :style="{'width': (100 / $parent.l) + '%'}"
        class="graph-cumulative-vs-growth">
        <div
            ref="container"
            class="graph-cumulative-vs-growth__container">
            <svg fill="#fff">
                <g class="graph-cumulative-vs-growth__content"></g>
            </svg>
        </div>
    </div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';



    .graph-cumulative-vs-growth {
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