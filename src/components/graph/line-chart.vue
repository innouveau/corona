<script>
    import * as d3 from 'd3';
    import $ from 'jquery';
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
            },
            getValue: {
                type: Function,
                required: true
            },
            applyLogScale: {
                type: Boolean,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            xAxisLabel: {
                type: String,
                required: true
            }
        },
        computed: {
            logScale() {
                return this.$store.state.settings.logScale;
            },
            cutYaxis() {
                return this.$store.state.settings.cutYaxis;
            },
            showEvents() {
                return this.$store.state.settings.showEvents;
            },
            cumulative() {
                return this.$store.state.settings.cumulative;
            },
            graphSetting() {
                return this.$store.state.settings.graphSetting;
            },
            drawRaw() {
                return this.type !== 'growth' && this.graphSetting !== 'Smoothened';
            },
            drawSmoothened() {
                return this.graphSetting !== 'Raw data' || this.type === 'growth';
            },
            smoothen() {
                return this.type === 'growth';
            },
            dotsBasedOnSmoothened() {
                return !this.drawRaw
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
            draw() {
                let n, min, max;
                this.min = 0;
                n = 0;
                min = null;
                max = 0;


                for (let country of this.data) {
                    let thisMin, thisMax;
                    if (!this.cutYaxis) {
                        // 0 gives trouble for logscale
                        if (this.logScale && this.applyLogScale) {
                            thisMin = 1;
                        } else {
                            thisMin = 0;
                        }
                    } else {
                        thisMin = d3.min(country.dataPoints.map(d => this.getValue(country, d, !this.drawRaw, true)));
                    }

                    thisMax = d3.max(country.dataPoints.map(d => this.getValue(country, d, !this.drawRaw, true)));
                    if (country.dataPoints.length > n) {
                        n = country.dataPoints.length;
                    }
                    if ((min === null || thisMin < min) && thisMin !== null) {
                        min = thisMin;
                    }
                    if (thisMax > max) {
                        max = thisMax;
                    }
                }
                this.min = min;
                this.max = max;

                this.xScale = d3.scaleLinear()
                    .domain([0, n-1])
                    .range([0, this.settings.width]);


                if (this.logScale && this.applyLogScale) {
                    this.yScale = d3.scaleLog()
                        .domain([min, this.max])
                        .range([this.settings.height, 0]);

                        this.yScale.tickFormat(4,d3.format(",d"))
                } else {
                    this.yScale = d3.scaleLinear()
                        .domain([min, this.max])
                        .range([this.settings.height, 0]);
                }


                this.drawAxes();
                if (this.type === 'growth' && !this.cumulative && this.data.length > 0) {
                    this.drawOneLine();
                }
                this.drawVisor();
                this.drawTitle();
                this.drawXAxisLabel();

                for (let country of this.data) {
                    if (country.dataPoints.length > 0) {
                        this.drawRegion(country);
                    }
                }
                this.repositionLabels();
            },
            drawRegion(country) {
                this.drawRegionLines(country);
                this.drawRegionLabel(country);
                if (this.showEvents){
                    this.drawEvents(country);
                }
            },

            drawEvents(country) {
                for (let event of country.events) {
                    let index = this.getIndexByDate(event.date, country.dataPoints);
                    if (index > -1) {
                        if (this.$store.state.settings.eventTypes.indexOf(event.type) > -1) {
                            this.drawEvent(country, index, event);
                        }
                    }
                }
            },
            drawEvent(country, index, event) {
                let x, y, eventGroup, circle;
                x = this.xScale(index);
                y = this.yScale(this.getValue(country, country.dataPoints[index], this.drawSmoothened));

                eventGroup = this.eventsLayer.append('g')
                    .attr('class', 'event-group')
                    .attr('transform', 'translate(' + x + ',' + y + ')');

                circle = eventGroup.append('circle')
                    .attr('class', 'event')
                    .attr('r', 7)
                    .attr('fill', function(d){
                        if (country.visible) {
                            return country.color;
                        } else {
                            return 'transparent';
                        }
                    })
                    .style('opacity',0.2);

                circle.on("mouseover", () => {
                    if (country.visible) {
                        this.showEventInfo(country, event, country.dataPoints[index], index);
                    }
                })
                    .on("mouseout", (d) => {
                        if (country.visible) {
                            this.hideEventInfo();
                        }
                    });
            },
            drawRegionLines(country) {
                if (this.drawRaw) {
                    this.drawRegionLineRaw(country);
                }
                if (this.drawSmoothened) {
                    this.drawRegionLineSmoothened(country);
                }
                this.drawRegionDots(country);
            },
            drawRegionLineSmoothened(country) {
                let line = d3.line()
                    .x((d, i) => { return this.xScale(i); })
                    .y((d) => { return this.yScale(this.getValue(country, d, true)); })
                    .curve(d3.curveMonotoneX);

                this.linesLayer.append("path")
                    .datum(country.dataPoints)
                    .attr("class", "line line--smoothened")
                    .attr("stroke", () => {
                        if (country.visible) {
                            return country.color;
                        } else {
                            return 'transparent';
                        }
                    })
                    .style('fill', 'transparent')
                    .attr("d", line)
                    //.attr('stroke-dasharray', '4,3')
                    .attr('stroke-width', '1.5');
            },
            drawRegionLineRaw(country) {
                let line = d3.line()
                    .x((d, i) => { return this.xScale(i); })
                    .y((d) => { return this.yScale(this.getValue(country, d, false)); })
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
                    .attr('stroke-width', ()=> {
                        if (!this.drawSmoothened) {
                            return 1;
                        } else {
                            return 0.1;
                        }
                    });
            },
            drawAxes() {
                let tickFormat = (value) => {
                    let range, step, factor, decimals, stringLength;
                    range = this.max - this.min;
                    step = range / this.ticks;

                    if (step < 1) {
                        return value;
                    } else {
                        if (value > 999) {
                            factor = this.max / step;
                            decimals = Math.round(Math.log(factor)/Math.log(10));
                            if (value > 999999) {
                                stringLength = ('' + Math.round(this.max)).length - 6;
                            } else {
                                stringLength = ('' + Math.round(this.max)).length - 3;
                            }


                            console.log(stringLength);
                            console.log(factor, decimals);
                            //return d3.format('.1s')(value);
                            return d3.format('.' + (decimals + stringLength) + 's')(value);
                        } else {
                            return value;
                        }
                    }

                    // console.log(this.min, this.max, this.ticks);

                    // if (value > 999) {
                    //
                    //     return d3.format(".2s")(value);
                    // } else if (value >= 2) {
                    //     return value;
                    // } else {
                    //     return value;
                    //     //return value.toFixed(2);
                    // }
                };

                this.ticks = 7;

                this.container = this.main
                    .append("g")
                    .attr("transform", "translate(" + this.settings.margin.left + "," + this.settings.margin.top + ")");

                this.container.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + this.settings.height + ")")
                    .call(d3.axisBottom(this.xScale));

                if (this.logScale && this.applyLogScale) {
                    this.ticks = Math.round(Math.log(this.max)/Math.log(10));
                    this.container.append("g")
                        .attr("class", "y axis")
                        .call(d3.axisLeft(this.yScale)
                            .ticks(ticks)
                            .tickFormat(d3.format(".0s"))
                        );
                } else {
                    this.container.append("g")
                        .attr("class", "y axis")
                        .call(d3.axisLeft(this.yScale)
                            .tickFormat(tickFormat))
                }

                this.linesLayer = this.container.append('g')
                    .attr('class', 'lines');

                this.eventsLayer = this.container.append('g')
                    .attr('class', 'events');

            },


            // getters
            getX(country, d, i) {
                return i;
            },
            getY(country, d, smoothened){
                return this.getValue(country, d, smoothened)
            },
            getIndexByDate(date, dataPoints) {
                let index = 0;
                for (let dataPoint of dataPoints) {
                    if (dataPoint.date === date) {
                        return index;
                    }
                    index ++;
                }
                return -1;
            },


            // events
            showEventInfo(country, event, d, i) {
                let chart, x, y, html,  parent, parentX, parentY;
                parent = $(this.$refs.container);
                parentX = parent.offset().left - 12;
                parentY = parent.offset().top;
                x = parentX + this.xScale(i);
                y = parentY + this.yScale(this.getValue(country, d, this.smoothen));
                chart = this.$refs.container;

                html = country.title + ': ' + event.title;

                this.eventInfo
                    .style("opacity", 1);

                this.eventInfo
                    .style("border-left", "4px solid " + country.color);

                this.eventInfo.html(html)
                    .style("top", (chart.offsetTop + y + 60) + "px")
                    .style("left", (chart.offsetLeft + x) + 70 + "px");
            },
            hideEventInfo() {
                this.eventInfo
                    .style("opacity", 0);
            },
            drawEventInfo() {
                this.eventInfo = d3.select("body").append("div")
                    .attr("class", "event-info")
                    .style("opacity", 0);
            },
        },
        mounted() {
            this.drawTooltip();
            this.drawEventInfo();
            this.init();
            this.update();
        }
    }
</script>


<template>
    <div class="line-chart">
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

            .save-image {
                display: flex;
                align-items: center;
                cursor: pointer;

                .save-image__icon {
                    box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
                    padding: 2px;
                    margin-right: 4px;
                    width: 24px;
                    height: 24px;
                    border-radius: 2px;
                    background: #fff;

                    img {
                        width: 100%;
                    }
                }

                .save-image__label {
                    font-size: 8px;
                    display: none;
                }

                &:hover {

                    .save-image__icon {
                        background: orange;
                    }
                }
            }
        }

        .line-chart__container {

            svg {

                .lines {

                    .line {
                        pointer-events: none;
                    }

                    .dot {

                        .dot__visbile-area {
                            pointer-events: none;
                        }
                    }
                }

                .visor {
                    stroke-width: 1;
                    stroke: #aaa;
                }

                .one-line {

                }
            }
        }
    }

    .event-info {
        position: absolute;
        background: #ddd;
        pointer-events: none;
        opacity: 0;
        padding: 4px;
        border: 1px solid #aaa;
    }

    .tooltip {
        position: absolute;
        text-align: center;
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 2px;
        pointer-events: none;
        opacity: 0;
        box-shadow: 1px 1px 4px rgba(0,0,0,0.2);

        .tooltip__country {
            height: 100%;
            display: flex;
            align-items: center;
            padding: 5px;
            margin-left: 4px;
            border-right: 1px solid #ddd;
        }

        .tooltip__date {
            height: 100%;
            display: flex;
            align-items: center;
            padding: 5px;
        }

        .tooltip__value {
            background: #ddd;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 5px;
        }
    }
</style>