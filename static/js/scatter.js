/**
 * @class Scatter
 */
class Scatter {

    data = [];

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    xLine
    yLine

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    // Tools
    scX = d3.scaleLinear()
        .range([0, this.gW]);
    scY = d3.scaleLinear()
        .range([this.gH, 0]);
    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();

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
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text('Years of Experience');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('Homework Hours');


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

        const all_points = vis.data.map(d => {
            return {
                x: d.experience_yr,
                y: d.hw1_hrs
            }
        });
        const points = [];
        for(const point of all_points) {
            const inPointArray = points.find(p => p.x === point.x && p.y === point.y)
            if(inPointArray) {
                inPointArray.count += 1
            } else {
                points.push({
                    x: point.x,
                    y: point.y,
                    count: 1
                })
            }
        }
        vis.data = points;


        // Update scales
        vis.scX.domain(d3.extent(points,d => d.x));
        vis.scY.domain([0, d3.max(points,d => d.y)]);
        vis.xAxis.scale(vis.scX);
        vis.yAxis.scale(vis.scY);


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

        // Build bars
        for(const point of vis.data) {
            vis.g
                .append('circle')
                .attr('cx', vis.scX(point.x))
                .attr('cy', vis.scY(point.y))
                .attr("r", 2 * point.count)
                .style("fill", "#260E7B")
                .on('mouseover', (d, i, t) => {
                    d3.select(t[0])
                        .transition()
                        .duration(100)
                        .style("fill", "#C62928");
                    vis.xLine = vis.g.append('rect')
                        .attr('x',vis.scX(0))
                        .attr('y',vis.scY(point.y))
                        .attr('width', vis.gW)
                        .attr('height', 1)
                        .attr('fill', "#EB3223")
                    vis.yLine = vis.g.append('rect')
                        .attr('x',vis.scX(point.x))
                        .attr('y',0)
                        .attr('width', 1)
                        .attr('height', vis.gH)
                        .attr('fill', "#EB3223")
                    vis.xLine.lower()
                    vis.yLine.lower()

                })
                .on('mouseout', (d, i, t) => {
                    d3.select(t[0])
                        .transition()
                        .duration(100)
                        .style("fill", "#260E7B")
                    vis.xLine.remove()
                    vis.yLine.remove()
                })
            }

        /*
        vis.g.append('g')
            .data(vis.points)
            .join(enter => enter
                .append('circle')

            )
        */
        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
}
