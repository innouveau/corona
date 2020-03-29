<script>
    import * as d3 from 'd3';

    export default {
        name: 'line-chart',
        components: {},
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        data() {
            let margin = {top: 50, right: 50, bottom: 50, left: 50};
            return {
                settings: {
                    margin,
                    width: 800 - margin.left - margin.right,
                    height: 300 - margin.top - margin.bottom
                },
                svg: null,
                xScale: null,
                yScale: null
            }
        },
        computed: {
            mapping() {
                return this.$store.state.mapping;
            },
            countries() {
                return this.$store.state.countries.all;
            }
        },
        methods: {
            update() {
                this.clear();
                this.draw()

            },
            clear() {
                if (this.svg) {
                    d3.selectAll('svg').remove();
                }
            },
            draw() {
                let n, max;
                n = 0;
                max = 0;

                for (let country of this.data) {
                    let thisMax = d3.max(country.dataPoints.map(d => d.fatalities));
                    if (country.dataPoints.length > n) {
                        n = country.dataPoints.length;
                    }
                    if (thisMax > max) {
                        max = thisMax;
                    }
                }


                this.xScale = d3.scaleLinear()
                    .domain([0, n-1])
                    .range([0, this.settings.width]);

                this.yScale = d3.scaleLinear()
                    .domain([0, max])
                    .range([this.settings.height, 0]);

                this.drawAxes();

                for (let country of this.data) {
                    this.drawCountry(country);
                }
            },
            drawCountry(country) {
                let line, dataset;

                dataset = country.dataPoints;
                line = d3.line()
                    .x((d, i) => { return this.xScale(i); })
                    .y((d) => { return this.yScale(d.fatalities); })
                    .curve(d3.curveMonotoneX);


                this.svg.append("path")
                    .datum(dataset)
                    .attr("class", "line")
                    .attr("stroke", country.color)
                    .attr("d", line);

                this.svg.selectAll(".dot")
                    .data(dataset)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("fill", country.color)
                    .attr("cx", (d, i) => { return this.xScale(i) })
                    .attr("cy", (d) => { return this.yScale(d.fatalities) })
                    .attr("r", 2)
                    .on("mouseover", (a, b, c) => {

                    })
            },
            drawAxes() {
                this.svg = d3.select(".line-chart").append("svg")
                    .attr("width", this.settings.width + this.settings.margin.left + this.settings.margin.right)
                    .attr("height", this.settings.height + this.settings.margin.top + this.settings.margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + this.settings.margin.left + "," + this.settings.margin.top + ")");

                this.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + this.settings.height + ")")
                    .call(d3.axisBottom(this.xScale));

                this.svg.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(this.yScale));
            }
        },
        mounted() {
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
            }
        }
    }
</script>


<template>
    <div class="line-chart"></div>
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
            stroke: #fff;
        }

        .focus circle {
            fill: none;
            stroke: steelblue;
        }
    }
</style>