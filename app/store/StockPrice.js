Ext.define('HighCharts.store.StockPrice', {
  extend : 'Ext.data.Store',
  autoLoad : false,
  //model: 'HighCharts.model.StockPrice',
  proxy : {
    type : 'jsonp',
    url : 'http://www.highcharts.com/samples/data/jsonp.php',
    reader : {
      type : 'array'
    }
  }
});
