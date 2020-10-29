<script>
    import * as d3 from "d3";
    import saveSVGmodule from "save-svg-as-png";
    import logo from "@/components/elements/logo";
    import $ from "jquery";
    import consts from '@/data/consts';

    export default {
        name: 'graph-mixin',
        components: {
            logo
        },
        props: {},
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
            },
            l() {
                return this.$store.state.types.all.filter(t => t.active).length;
            },
            perCapita() {
                return this.$store.state.settings.perCapita;
            },
        },
        methods: {
            clear() {
                if (this.main) {
                    this.main.selectAll('*').remove();
                }
            },
            init() {
                this.svg = d3.select(this.$refs.container).select('svg');
                this.main = this.svg.select('.line-chart__content');
                this.logo = d3.select(this.$refs.container).select('.line-chart__logo');
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
            // drawing
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
            drawYAxisLabel() {
                this.main.append('g')
                    .attr('class', 'y-axis-label')
                    .attr('transform', () => {
                        let x, y, string;
                        x = 12;
                        y = this.settings.height + this.settings.margin.top + 2;
                        string = 'translate(' + x + ',' + y + ') rotate(-90)';
                        return string;
                    })
                    .append('text')
                    .text(this.yAxisLabel)
                    .style('font-size', '9px')
                    .attr('fill', '#888')
                    .style('font-family', 'Montserrat, sans-serif');
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
            drawRegionDots(country) {
                let dots = this.linesLayer.selectAll(".dot.dot--" + country.id)
                    .data(country.dataPoints)
                    .enter().append("g")
                    .attr("class", "dot dot--" + country.id);


                dots.append("circle")
                    .attr("fill", "transparent")
                    .attr("cx", (d, i) => { return this.xScale(this.getX(country, d, i)) })
                    .attr("cy", (d) => { return this.yScale(this.getY(country, d, this.dotsBasedOnSmoothened)) })
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
                    .attr("cx", (d, i) => { return this.xScale(this.getX(country, d, i)) })
                    .attr("cy", (d) => {
                        return this.yScale(this.getY(country, d, this.dotsBasedOnSmoothened))
                    })
                    .attr("r", 2)
                    .attr("class", "dot__visbile-area")
                    .style('stroke', '#fff');
            },
            drawRegionLabel(country) {
                let dataset, lastPoint, x, y, i;

                dataset = country.dataPoints;
                i = dataset.length - 1;
                lastPoint = dataset[i];
                x = this.xScale(this.getX(country, lastPoint, i)) + 6;
                y = this.yScale(this.getY(country, lastPoint)) + 2;
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
                        lastPoint,
                        lastPointValue: this.yScale(this.getY(country, lastPoint, true)) + 2
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
                    x = this.xScale(this.getX(item.country, item.lastPoint, (item.country.dataPoints.length - 1))) + 6;
                    label.attr('transform', 'translate(' + x + ',' + lastY + ')');
                }

            },

            // events

            showVisor(country, d, i) {
                let x, y;
                x = this.xScale(this.getX(country, d, i));
                y = this.yScale(this.getY(country, d, this.dotsBasedOnSmoothened));
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
                let chart, parent, parentX, parentY, x, y, html,
                    value, windowWidth, elementWidth;

                parent = $(this.$refs.container);
                parentX = parent.offset().left - 12;
                parentY = parent.offset().top;

                x = parentX + this.xScale(this.getX(country, d, i));
                y = parentY + this.yScale(this.getY(country, d, this.dotsBasedOnSmoothened));
                chart = this.$refs.container;
                windowWidth = window.innerWidth;

                if (this.type === 'cumulative-vs-growth') {

                    if (this.perCapita) {
                        value = (1000000 * d.delta_cases / country.population).toFixed(1);
                    } else {
                        value = d.delta_cases;
                    }
                } else {
                    value = this.getY(country, d, this.smoothen);
                    if (this.type === 'growth') {
                        value = value.toFixed(3);
                    }
                    if (value === consts.virtualZero) {
                        value = 0;
                    } else if (this.type !== 'growth' && this.perCapita) {
                        if (value > 10) {
                            value = Math.round(value);
                        } else {
                            if (value > 1) {
                                value = value.toFixed(1);
                            } else {
                                value = value.toFixed(2);
                            }
                        }
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
            drawTooltip() {
                this.tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
            },

            // other
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
            },
            l: {
                handler: function(newValue) {
                    this.update();
                },
            }
        }
    }
</script>


<template></template>


<style lang="scss">
    @import '@/styles/variables.scss';

    .graph-mixin {

    }
</style>