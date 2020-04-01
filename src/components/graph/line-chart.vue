<script>
    import * as d3 from 'd3';

    export default {
        name: 'line-chart',
        components: {},
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
            }
        },
        data() {
            let margin = {top: 20, right: 50, bottom: 50, left: 50};
            return {
                settings: {
                    margin,
                    width: 0,
                    height: 400 - margin.top - margin.bottom
                },
                svg: null,
                container: null,
                xScale: null,
                yScale: null,
                tooltip: null
            }
        },
        computed: {
            mapping() {
                return this.$store.state.settings;
            },
            countries() {
                return this.$store.state.countries.all;
            },
            logScale() {
                return this.$store.state.settings.logScale;
            },
            cutY() {
                return this.$store.state.settings.cutY;
            },
            l() {
                return this.$store.state.types.all.filter(t => t.active).length;
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
                if (this.svg) {
                    this.svg.selectAll('*').remove();
                }
            },
            setWidth() {
                this.settings.width = this.$refs.chart.offsetWidth - this.settings.margin.left - this.settings.margin.right;
            },
            draw() {
                let n, min, max;
                n = 0;
                min = null;
                max = 0;

                for (let country of this.data) {
                    let thisMin, thisMax;
                    if (!this.cutY) {
                        // 0 gives trouble for logscale
                        if (this.logScale && this.applyLogScale) {
                            thisMin = 1;
                        } else {
                            thisMin = 0;
                        }
                    } else {
                        thisMin = d3.min(country.dataPoints.map(d => this.getValue(country, d)));
                    }

                    thisMax = d3.max(country.dataPoints.map(d => this.getValue(country, d)));
                    if (country.dataPoints.length > n) {
                        n = country.dataPoints.length;
                    }
                    if ((!min || thisMin < min) && thisMin !== null) {
                        min = thisMin;
                    }
                    if (thisMax > max) {
                        max = thisMax;
                    }
                }


                this.xScale = d3.scaleLinear()
                    .domain([0, n-1])
                    .range([0, this.settings.width]);


                if (this.logScale && this.applyLogScale) {
                    this.yScale = d3.scaleLog()
                        .domain([min, max])
                        .range([this.settings.height, 0]);
                } else {
                    this.yScale = d3.scaleLinear()
                        .domain([min, max])
                        .range([this.settings.height, 0]);
                }


                this.drawAxes();

                for (let country of this.data) {
                    this.drawCountry(country);
                }
            },
            drawCountry(country) {
                let line, dataset, dots;

                dataset = country.dataPoints;
                line = d3.line()
                    .x((d, i) => { return this.xScale(i); })
                    .y((d) => { return this.yScale(this.getValue(country, d)); })
                    .curve(d3.curveMonotoneX);


                this.container.append("path")
                    .datum(dataset)
                    .attr("class", "line")
                    .attr("stroke", () => {
                        if (country.visible) {
                            return country.color;
                        } else {
                            return 'transparent';
                        }
                    })
                    .attr("d", line);

                dots = this.container.selectAll(".dot.dot--" + country.id)
                    .data(dataset)
                    .enter().append("g")
                    .attr("class", "dot dot--" + country.id);


                dots.append("circle")
                    .attr("fill", "transparent")
                    .attr("cx", (d, i) => { return this.xScale(i) })
                    .attr("cy", (d) => { return this.yScale(this.getValue(country, d)) })
                    .attr("r", 5)
                    .attr("class", "dot__active-area")
                    .on("mouseover", (d) => {
                        this.showTooltip(d, country)
                    })
                    .on("mouseout", (d) => {
                        this.hideTooltip()
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
                    .attr("cy", (d) => { return this.yScale(this.getValue(country, d)) })
                    .attr("r", 2)
                    .attr("class", "dot__visbile-area");
            },
            showTooltip(d, country) {
                let html, value;
                value = this.getValue(country, d);
                html = '<div class="tooltip__country">' + country.title + '</div><div class="tooltip__date">' + d.date + '</div><div class="tooltip__value">' + value + '</div>';

                this.tooltip
                    .style("opacity", 1);

                this.tooltip
                    .style("border-left", "4px solid " + country.color);

                this.tooltip.html(html)
                    .style("left", (d3.event.pageX - 50) + "px")
                    .style("top", (d3.event.pageY - 38) + "px");
            },
            hideTooltip() {
                this.tooltip
                    .style("opacity", 0);
            },
            drawTooltip() {
                this.tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
            },
            drawAxes() {
                this.container = this.svg
                    .attr("width", this.settings.width + this.settings.margin.left + this.settings.margin.right)
                    .attr("height", this.settings.height + this.settings.margin.top + this.settings.margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + this.settings.margin.left + "," + this.settings.margin.top + ")");

                this.container.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + this.settings.height + ")")
                    .call(d3.axisBottom(this.xScale));

                this.container.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(this.yScale));
            },
            init() {
                let div = this.$refs.chart;
                this.svg = d3.select(div).append("svg");
            }
        },
        mounted() {
            this.drawTooltip();
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
    <div
        ref="chart"
        class="line-chart"></div>
</template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .line-chart {

        .line {
            fill: none;
            stroke-width: 1;
        }

        .overlay {
            fill: none;
            pointer-events: all;
        }

        .dot {


            .dot__visbile-area {
                pointer-events: none;
                stroke: #fff;
            }
        }

        .focus circle {
            fill: none;
            stroke: steelblue;
        }
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