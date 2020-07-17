/**
 * @class Donut
 */
class Donut {

    // Elements
    svg = null;
    g = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 10, right: 10, bottom: 10, left: 10};
    gW = (this.svgW - (this.gMargin.right + this.gMargin.left))/2;
    gH = (this.svgH - (this.gMargin.top + this.gMargin.bottom))/2;

    radius = Math.min(this.gW, this.gH) / 2;
    // Tools
    donut = d3.pie();
    arc = d3.arc()
        .innerRadius(this.radius/1.5)
        .outerRadius(this.radius);
    big_arc = d3.arc()
        .innerRadius(this.radius/2)
        .outerRadius(this.radius * 1.2);
    donut_data = []
    color = d3.scaleOrdinal(["#A52137","#C62928","#7E194B",
        "#EB3223","#5D1362","#39107B"]);

    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.svgW/2}px, ${vis.svgH/2}px)`);
        vis.g.append('text')
            .attr('class', 'label')
            .text('')
            .attr('text-anchor', 'middle');
        vis.svg.append('text')
            .attr('class', 'label')
            .text('Programming Languages')
            .attr('text-anchor', 'middle')
            .attr("x", `${(vis.svgW / 2)}px`)
            .attr("y", `${vis.gMargin.top + vis.gMargin.bottom}px`)
        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;
        // Map ages

        let data = {};
        vis.data.forEach(d => {
            if(!data[d.prog_lang]) {
                data[d.prog_lang] = {
                    lang: d.prog_lang,
                    count: 0,
                    percentage: 0
                }
            }
            data[d.prog_lang].count += 1
        })
        data = Object.values(data);
        const total = data.reduce((a, d) => a + d.count, 0);
        data = data.map(d => {
            d.percentage = d.count / total
            return d;
        });
        vis.donut_data = data
        vis.donut = vis.donut.value(d => d.count)
        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        const g = vis.g.selectAll("g")
            .data(vis.donut(vis.donut_data));
        const text = g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em");
        // Enter new arcs
        g.enter().append("path")
            .attr("fill", (d, i) => vis.color(i))
            .attr("d", vis.arc)
            .attr('opacity', '.9')
            .each(function(d) { this._current = d; })
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration(500)
                    .attr('opacity', '1')
                    .attr('d', vis.big_arc)
                vis.g.select('text')
                    .text(`${d.data.lang} ${d.data.percentage * 100}%`)
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration(200)
                    .attr('opacity', '.9')
                    .attr('d', vis.arc)
            })
    }
}
