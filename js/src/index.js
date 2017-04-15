import * as d3 from "../../node_modules/d3";

let query = 'SELECT * FROM t1 LIMIT 10';
let url = 'http//api.treasury.io/cc7znvq/47d80ae900e04f2/sql/?q='+query;

d3.request(url)
.mimeType("text/csv")
.response(function(xhr) { return d3.csvParse(xhr.responseText, row); })
.get(callback);

function callback(x) {
  console.log(x);
}
