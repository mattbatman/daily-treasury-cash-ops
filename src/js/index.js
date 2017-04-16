import * as d3 from "../../node_modules/d3";

treasuryIo('SELECT * FROM t1 LIMIT 10', callback);

function treasuryIo(query){
  return d3.json('http//api.treasury.io/cc7znvq/47d80ae900e04f2/sql/?q='+query, callback);
}

function callback(x) {
  console.log(x);
}
