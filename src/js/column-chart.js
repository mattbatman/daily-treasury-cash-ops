import * as d3 from './manual-d3-bundle';

export function ColumnChart() {
  // declare variables
  let data = [];
  let svg;
  let margin = { top: 10, right: 10, bottom: 30, left: 30 };
  let width = 400 - margin.left - margin.right;
  let height = 565 - margin.top - margin.bottom;
  let yScale;
  let yAxis;
  let xScale;
  let xAxis;
  // initialize chart for rendering
  const init = function() {
    svg = d3.select('.chart')
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .call(responsivefy)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    yScale = d3.scaleLinear();
    yAxis = d3.axisLeft(yScale);
    xScale = d3.scaleBand();
    xAxis = d3.axisBottom(xScale);

    svg
      .append('g')
        .attr('transform', `translate(0, ${height})`)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)');
  };
  // update chart with new data
  const update = function(d) {
    data = d;

    console.log(data);

    yScale
      .domain([
        0,
        d3.max(data, d => d.amount)
      ])
      .range([height, 0]);

    xScale
      .domain(data.map(d => d.item))
      .range([0, width]);

    svg.call(yAxis);
    svg.call(xAxis);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.item))
      .attr('y', d => yScale(d.amount))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - yScale(d.amount));
  };

  // taken from egghead d3 tutorial
  function responsivefy(svg) {
    // get container + svg aspect ratio
    let container = d3.select(svg.node().parentNode);
    let width = parseInt(svg.style('width'));
    let height = parseInt(svg.style('height'));
    let aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on('resize.' + container.attr('id'), resize);

    // get width of container and resize svg to fit it
    function resize() {
      let targetWidth = parseInt(container.style('width'));
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
    }
  }

  return {
    init: init,
    update: update
  };
}
