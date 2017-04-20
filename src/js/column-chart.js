import * as d3 from './manual-d3-bundle';

export function ColumnChart() {
  // declare variables
  let container;
  let data = [];
  let elClass = '.chart';
  let svg;
  const margin = { top: 15, right: 15, bottom: 30, left: 300 };
  let width;
  let height;
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

    yScale = d3.scaleBand();
    yAxis = d3.axisLeft(yScale);
    xScale = d3.scaleLinear();
    xAxis = d3.axisBottom(xScale);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);

    svg.append('g')
      .attr('class', 'y axis');
  };
  // update chart with new data
  const update = function(data) {

    yScale
      .domain(data.map(d => d.item))
      .range([0, height]);

    xScale
      .domain([
        0,
        d3.max(data, d => d.amount)
      ])
      .range([0, width]);

    xAxis
      .scale(xScale);
    yAxis
      .scale(yScale);

    svg.select('.x.axis')
      .call(xAxis);

    svg.select('.y.axis')
        .call(yAxis);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', _ => xScale(0))
      .attr('y', d => yScale(d.item))
      .attr('width', d => xScale(d.amount) - xScale(0))
      .attr('height', _ => yScale.bandwidth());

    container = d3.select(svg.node().parentNode);
    d3.select(window).on('resize.' + container.attr('id'), resize);
  };

  // get width of container and resize svg to fit it
  function resize() {
    width = parseInt(d3.select('.chart').style('width')) - margin.left - margin.right;
    height = parseInt(d3.select('.chart').style('height')) - margin.top - margin.bottom;
    yScale.range([0, height]);
    xScale.range([0, width]);
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    svg.select('.x.axis')
      .call(xAxis)
      .attr('transform', `translate(0, ${height})`);
    svg.select('.y.axis')
      .call(yAxis);
    svg.selectAll('rect')
      .attr('x', _ => xScale(0))
      .attr('y', d => yScale(d.item))
      .attr('width', d => xScale(d.amount) - xScale(0))
      .attr('height', _ => yScale.bandwidth());
  }

  return {
    init: init,
    update: update
  };
}
