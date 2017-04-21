import * as d3 from './manual-d3-bundle';

export function ColumnChart() {
  // declare variables
  let container;
  let data;
  let elClass = '.chart';
  let svg;
  const margin = { top: 15, right: 15, bottom: 35, left: 277 };
  let width;
  let height;
  let yScale;
  let yAxis;
  let xScale;
  let xAxis;
  let xLabel;
  let xTickNumber;
  let tooltipDiv;
  let tooltipTable;
  let tooltipHeader;
  let tooltipBody;
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

    yScale = d3.scaleBand().padding(0.05);
    yAxis = d3.axisLeft(yScale);
    xScale = d3.scaleLinear();
    xAxis = d3.axisBottom(xScale);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);

    svg.append('g')
      .attr('class', 'y axis');

    svg.append('g')
      .attr('class', 'x label')
      .attr('transform', `translate(0, ${height + margin.bottom - 3})`)
      .append('text')
      .text('Millions ($)')
      .classed('none', true);

    svg.append('g')
      .attr('class', 'no-data-message')
      .attr('transform', `translate(5, ${height / 2})`)
      .append('text')
      .text('There was no data. Try another date.')
      .classed('none', true);

    tooltipDiv = d3.select(elClass)
      .append('div')
      .attr('class', 'tooltip')
      .classed('none', true);

    tooltipTable = tooltipDiv
      .append('table');

    tooltipHeader = tooltipTable
      .append('thead')
      .append('tr')
      .append('th')
      .attr('colspan', '1');

    tooltipBody = tooltipTable
      .append('tbody')
      .append('tr')
      .append('td');
  };

  // update chart with new data
  const update = function(apiData) {

    dataLengthCheck(apiData);

    data = apiData;

    container = d3.select(svg.node().parentNode);

    var t = d3.transition().duration(1000);

    yScale
      .domain(data.map(d => d.item))
      .range([0, height]);

    xScale
      .domain([
        0,
        d3.max(data, d => d.amount)
      ])
      .range([0, width]);

    xTickNumber = xTicks(parseInt(container.style('width')));

    xAxis
      .ticks(xTickNumber)
      .scale(xScale);
    yAxis
      .scale(yScale);

    svg.select('.x.label')
      .select('text')
      .classed('none', false);

    let rect = svg.selectAll('rect')
      .data(data);

    rect.exit()
      .transition(t)
      .attr('width', _ => xScale(0))
      .attr('x', _ => xScale(0))
      .remove();

    svg.select('.x.axis')
      .transition(t)
      .delay(data.length === rect.enter().size() ? 0 : 1000)
      .call(xAxis);

    svg.select('.y.axis')
    .transition(t)
    .delay(data.length === rect.enter().size() ? 0 : 1000)
      .call(yAxis);

    rect
      .transition(t)
      .delay(1000)
      .attr('y', d => yScale(d.item))
      .attr('height', _ => yScale.bandwidth())
      .attr('x', _ => xScale(0))
      .attr('width', d => xScale(d.amount) - xScale(0))

    rect
      .enter()
      .append('rect')
      .attr('width', _ => xScale(0))
      .attr('x', _ => xScale(0))
      .attr('y', d => yScale(d.item))
      .attr('height', _ => yScale.bandwidth())
      .on('mouseover', (d) => {
        tooltipHeader.text(d.item);
        tooltipBody.text(`${d3.format('$,')(d.amount)} million`)
        tooltipDiv.classed('none', false)
        .style('left', () => {
          return  `${d3.event.pageX - 15}px`;
        })
        .style('top', () => {
          return  `${d3.event.pageY + 15}px`;
        })
      })
      .on('mouseout', (d) => {
        tooltipDiv.classed('none', true);
      })
      .transition(t)
      .delay(rect.exit().size() ? 2000 : 0)
      .attr('width', d => xScale(d.amount) - xScale(0));

    d3.select(window).on('resize.' + container.attr('id'), resize);
  };

  // get width of container and resize svg to fit it
  function resize() {
    width = parseInt(d3.select('.chart').style('width')) - margin.left - margin.right;
    height = parseInt(d3.select('.chart').style('height')) - margin.top - margin.bottom;
    yScale.range([0, height]);
    xScale.range([0, width]);
    xTickNumber = xTicks(parseInt(container.style('width')));
    xAxis
      .ticks(xTickNumber)
      .scale(xScale);
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

  function xTicks(containerWidth) {
    if (containerWidth < 450) {
      return 2;
    } else if (containerWidth < 550) {
      return 3;
    } else if (containerWidth < 650) {
      return 4;
    } else if (containerWidth < 800) {
      return 5;
    } else {
      return 6;
    }
  }

  function dataLengthCheck(d) {

    if (d.length === 0) {
      svg.select('.no-data-message')
        .select('text')
        .classed('none', false);
    } else {
      svg.select('.no-data-message')
        .select('text')
        .classed('none', true);
    }

  }

  return {
    init: init,
    update: update
  };
}
