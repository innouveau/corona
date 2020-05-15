<script>
    import * as d3 from 'd3';
    import $ from 'jquery';
    import saveSVGmodule from 'save-svg-as-png';
    import consts from '@/data/consts';
    import logo from "@/components/elements/logo";


    export default {
        name: 'line-chart',
        components: {
            logo
        },
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
            mapping() {
                return this.$store.state.settings;
            },
            countries() {
                return this.$store.state.regions.all;
            },
            logScale() {
                return this.$store.state.settings.logScale;
            },
            cutYaxis() {
                return this.$store.state.settings.cutYaxis;
            },
            l() {
                return this.$store.state.types.all.filter(t => t.active).length;
            },
            showEvents() {
                return this.$store.state.settings.showEvents;
            },
            cumulative() {
                return this.$store.state.settings.cumulative;
            },
            perCapita() {
                return this.$store.state.settings.perCapita;
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

                this.logo
                    .attr('transform', 'translate(' + x + ',' + y + ')')
            },
            draw() {
                let n, min, max, smoothen;
                n = 0;
                min = null;
                max = 0;
                smoothen = (this.type === 'growth');


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
                        thisMin = d3.min(country.dataPoints.map(d => this.getValue(country, d, smoothen, true)));
                    }

                    thisMax = d3.max(country.dataPoints.map(d => this.getValue(country, d, smoothen, true)));
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
            drawXAxisLabel() {
                this.main.append('g')
                    .attr('class', 'x-axis-label')
                    .attr('transform', 'translate(' + this.settings.margin.left + ',' + (this.settings.height + this.settings.margin.top + 40) + ')')
                    .append('text')
                    .text(this.xAxisLabel)
                    .style('font-size', '9px')
                    .attr('fill', '#888')
                    .style('font-family', 'Montserrat, sans-serif');
            },
            drawTitle() {
                this.main.append('g')
                    .attr('class', 'title')
                    .attr('transform', 'translate(' + this.settings.margin.left + ', 50)')
                    .append('text')
                    .text(this.title)
                    .style('font-size', '16px')
                    .style('font-weight', '700')
                    .attr('fill', '#000')
                    .style('font-family', 'Montserrat, sans-serif');
            },
            repositionLabels() {
                let countries, lastY, margin, x;
                margin = 6;
                lastY = null;
                countries = this.data.filter(country => {
                    return country.dataPoints.length > 0;
                }).map(country => {
                    let lastPoint = country.dataPoints[country.dataPoints.length - 1];
                    return {
                        country,
                        lastPointValue: this.yScale(this.getValue(country, lastPoint, true)) + 2
                    }
                });

                countries = countries.sort((a, b) => {
                    if ( a.lastPointValue < b.lastPointValue ){
                        return 1;
                    }
                    if ( a.lastPointValue > b.lastPointValue ){
                        return -1;
                    }
                    return 0;
                });
                for (let item of countries) {
                    let label = this.main.select('.country-label--' + item.country.id);
                    if (lastY !== null && item.lastPointValue > (lastY - margin)) {
                        lastY -= margin;
                    } else {
                        lastY = item.lastPointValue;
                    }
                    x = this.xScale(item.country.dataPoints.length - 1) + 6;
                    label.attr('transform', 'translate(' + x + ',' + lastY + ')');
                }

            },
            drawVisor() {
                this.visorX = this.container.append('line')
                    .attr('class', 'visor visor-x')
                    .attr('stroke-dasharray', '2,2')
                    .attr('x1', 10)
                    .attr('y1', 0)
                    .attr('x2', 10)
                    .attr('y2', this.settings.height)
                    .attr('visibility', 'hidden');

                this.visorY = this.container.append('line')
                    .attr('class', 'visor visor-y')
                    .attr('stroke-dasharray', '2,2')
                    .attr('x1', 0)
                    .attr('y1', 10)
                    .attr('x2', this.settings.width)
                    .attr('y2', 10)
                    .attr('visibility', 'hidden');
            },
            drawRegion(country) {
                this.drawRegionLines(country);
                this.drawRegionLabel(country);
                if (this.showEvents){
                    this.drawEvents(country);
                }
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
                y = this.yScale(this.getValue(country, country.dataPoints[index], true));

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
                if (this.type !== 'growth') {
                    this.drawRegionLineRaw(country);
                }
                this.drawRegionLineSmoothened(country);
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
                    .attr('stroke-width', '0.1');
            },
            drawRegionDots(country) {
                let smoothen = this.type === 'growth';

                let dots = this.linesLayer.selectAll(".dot.dot--" + country.id)
                    .data(country.dataPoints)
                    .enter().append("g")
                    .attr("class", "dot dot--" + country.id);


                dots.append("circle")
                    .attr("fill", "transparent")
                    .attr("cx", (d, i) => { return this.xScale(i) })
                    .attr("cy", (d) => { return this.yScale(this.getValue(country, d, smoothen)) })
                    .attr("r", 7)
                    .attr("class", "dot__active-area")
                    .on("mouseover", (d, i) => {
                        if (country.visible) {
                            this.showTooltip(country, d, i);
                            this.showVisor(country, d, i);
                        }
                    })
                    .on("mouseout", (d) => {
                        if (country.visible) {
                            this.hideTooltip();
                            this.hideVisor();
                        }
                    });

                dots.append("circle")
                    .attr("fill", () => {
                        if (country.visible) {
                            return country.color;
                        } else {
                            return 'transparent';
                        }
                    })
                    .attr("cx", (d, i) => { return this.xScale(i) })
                    .attr("cy", (d) => { return this.yScale(this.getValue(country, d, smoothen)) })
                    .attr("r", 2)
                    .attr("class", "dot__visbile-area")
                    .style('stroke', '#fff');
            },
            drawRegionLabel(country) {
                let dataset, lastPoint, x, y;

                dataset = country.dataPoints;
                lastPoint = dataset[dataset.length - 1];
                x = this.xScale(dataset.length - 1) + 6;
                y = this.yScale(this.getValue(country, lastPoint, true)) + 2;
                this.linesLayer.append("g")
                    .attr("class", "country-label country-label--" + country.id)
                    .attr('transform', 'translate(' + x + ',' + y + ')')
                    .attr('fill', () => {
                        if (country.visible) {
                            return country.color;
                        } else {
                            return 'transparent';
                        }
                    })
                    .style('font-size', '8px')
                    .style('font-family', 'Montserrat, sans-serif')
                    .append('text')
                    .text(country.title)

            },

            // events

            showVisor(country, d, i) {
                let x, y;
                x = this.xScale(i);
                y = this.yScale(this.getValue(country, d));
                this.visorX.attr('x1', x)
                    .attr('x2', x)
                    .attr('visibility', 'visible');

                this.visorY.attr('y1', y)
                    .attr('y2', y)
                    .attr('visibility', 'visible')
            },
            hideVisor(d){
                this.visorX.attr('visibility', 'hidden');

                this.visorY.attr('visibility', 'hidden')
            },
            showTooltip(country, d, i) {
                let chart, x, y, html, value, windowWidth, elementWidth;
                x = this.xScale(i);
                y = this.yScale(this.getValue(country, d));
                chart = this.$refs.container;
                windowWidth = window.innerWidth;
                value = this.getValue(country, d);
                if (this.type === 'growth') {
                    value = value.toFixed(3);
                }
                if (value === consts.virtualZero) {
                    value = 0;
                } else if (this.type !== 'growth' && this.perCapita) {
                    if (value > 10) {
                        value = Math.round(value);
                    } else {
                        value = value.toFixed(1);
                    }
                }


                html = '<div class="tooltip__country">' + country.title + '</div><div class="tooltip__date">' + d.date + '</div><div class="tooltip__value">' + value + '</div>';

                this.tooltip.html(html);

                elementWidth = $(this.tooltip.node()).outerWidth();
                if (chart.offsetLeft + x + 70 + elementWidth >  windowWidth) {
                    x = chart.offsetLeft + x + 40 - elementWidth;
                } else {
                    x = (chart.offsetLeft + x) + 70;
                }



                this.tooltip
                    .style("opacity", 1);

                this.tooltip
                    .style("border-left", "4px solid " + country.color);

                this.tooltip
                    .style("top", (chart.offsetTop + y + 50) + "px")
                    .style("left", x + "px");
            },
            hideTooltip() {
                this.tooltip
                   .style("opacity", 0);
            },
            showEventInfo(country, event, d, i) {
                let chart, x, y, html, value;
                x = this.xScale(i);
                y = this.yScale(this.getValue(country, d));
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
            drawTooltip() {
                this.tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
            },
            drawEventInfo() {
                this.eventInfo = d3.select("body").append("div")
                    .attr("class", "event-info")
                    .style("opacity", 0);
            },
            drawOneLine() {
                let x1, x2, y;

                x1 = this.xScale(0);
                x2 = this.xScale(this.data[0].dataPoints.length - 1);
                y = this.yScale(1);

                this.container.append("g")
                    .attr("class", "one-line")
                    .append('line')
                    .attr('x1', x1)
                    .attr('x2', x2)
                    .attr('y1', y)
                    .attr('y2', y)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#aaa');
            },
            drawAxes() {


                this.container = this.main
                    .append("g")
                    .attr("transform", "translate(" + this.settings.margin.left + "," + this.settings.margin.top + ")");

                this.container.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + this.settings.height + ")")
                    .call(d3.axisBottom(this.xScale));

                if (this.logScale && this.applyLogScale) {
                    let ticks = Math.round(Math.log(this.max)/Math.log(10));
                    this.container.append("g")
                        .attr("class", "y axis")
                        .call(d3.axisLeft(this.yScale)
                            .ticks(ticks)
                            .tickFormat(d3.format(".0s"))
                        );
                } else {
                    this.container.append("g")
                        .attr("class", "y axis")
                        .call(d3.axisLeft(this.yScale));
                }

                this.linesLayer = this.container.append('g')
                    .attr('class', 'lines');

                this.eventsLayer = this.container.append('g')
                    .attr('class', 'events');

            },
            init() {
                this.svg = d3.select(this.$refs.container).select('svg');
                this.main = this.svg.select('.line-chart__content');
                this.logo = d3.select(this.$refs.container).select('.line-chart__logo');
            },
            saveImage() {
                let node, options;
                node = this.svg.node();
                options = {
                    backgroundColor: '#fff',
                    scale: 2
                };
                this.showLogo = true;
                saveSVGmodule.saveSvgAsPng(node, "covid-19-chart.png", options);
                setTimeout(()=>{
                    this.showLogo = false;
                })
            }
        },
        mounted() {
            this.drawTooltip();
            this.drawEventInfo();
            this.init();
            this.update();
        },
        watch: {
            mapping:  {
                handler: function(newValue) {
                    this.update();
                },
                deep: true
            },
            countries:  {
                handler: function(newValue) {
                    this.update();
                },
                deep: true
            },
            l: {
                handler: function(newValue) {
                    this.update();
                },
            }
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
            z-index: 1;
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