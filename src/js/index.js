import * as d3 from './manual-d3-bundle';
import * as Flatpickr from '../../node_modules/flatpickr/dist/flatpickr.min.js';
import { ColumnChart } from './column-chart';

// set config and element variables for calendar
const pickerEl = document.querySelector('.flatpickr');
const pickerConfig = {
  altInput: true,
  minDate: new Date(2005, 5, 9),
  maxDate: new Date(),
  onChange: function(selectedDates, dateStr, instance) {
    treasuryIo(`SELECT * FROM t2 WHERE ("date" = '${dateStr}') AND ("transaction_type" = 'withdrawal')`);
  }
};
// initialize calendar
let calendar = new Flatpickr(pickerEl, pickerConfig);
// initialize d3 column chart
let columnChart = ColumnChart();
columnChart.init();
// pass query string in api call to treasury.io
function treasuryIo(query){
  return d3.json('http://api.treasury.io/cc7znvq/47d80ae900e04f2/sql/?q='+query, treasuryCallback);
}
// callback for treasury.io call
function treasuryCallback(res) {
  let data = res
    .map((x) => {
      return {
        amount: x.today,
        date: x.date,
        item: x.item,
      }
    });
  columnChart.update(data);
}
