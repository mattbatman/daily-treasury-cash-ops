import * as d3 from './manual-d3-bundle';

export function ColumnChart() {
  // declare variables
  let container;
  let data = [];
  let elClass = '.chart';
  let svg;
  let margin = { top: 30, right: 15, bottom: 250, left: 70 };
  let width = 400 - margin.left - margin.right;
  let height = 565 - margin.top - margin.bottom;
  let yScale;
  let yAxis;
  let xScale;
  let xAxis;
  // initialize chart for rendering
  const init = function() {
    width = parseInt(d3.select('.chart').style('width')) - margin.left - margin.right;
    height = parseInt(d3.select('.chart').style('height')) - margin.top - margin.bottom;
    svg = d3.select(elClass)
      .append('svg')
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    yScale = d3.scaleLinear();
    yAxis = d3.axisLeft(yScale);
    xScale = d3.scaleBand();
    xAxis = d3.axisBottom(xScale);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);

    svg.append('g')
      .attr('class', 'y axis');
  };
  // update chart with new data
  const update = function(d) {
    data = d;

    yScale
      .domain([
        0,
        d3.max(data, d => d.amount)
      ])
      .range([height, 0]);

    xScale
      .domain(data.map(d => d.item))
      .range([0, width]);

    xAxis
      .scale(xScale);
    yAxis
      .scale(yScale);

    svg.select('.x.axis')
        .call(xAxis)
      .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');

    svg.select('.y.axis')
      .call(yAxis);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.item))
      .attr('y', d => yScale(d.amount))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - yScale(d.amount));

    container = d3.select(svg.node().parentNode);
    d3.select(window).on('resize.' + container.attr('id'), resize);
  };

  // get width of container and resize svg to fit it
  function resize() {
    width = parseInt(svg.style('width')) - margin.left - margin.right;
    height = parseInt(svg.style('height')) - margin.top - margin.bottom;
    svg.attr('width', '100%');
    svg.attr('height', height);
    // yScale.range([height, 0]);
    // xScale.range([0, width]);
  }

  return {
    init: init,
    update: update
  };
}
